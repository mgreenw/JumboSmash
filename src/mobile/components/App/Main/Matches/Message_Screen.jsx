// @flow

import React from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import type {
  ReduxState,
  Dispatch,
  Match,
  GiftedChatMessage,
  UserProfile
} from 'mobile/reducers/index';
import GEMHeader from 'mobile/components/shared/Header';
import Avatar from 'mobile/components/shared/Avatar';
import type { NavigationScreenProp } from 'react-navigation';
import routes from 'mobile/components/navigation/routes';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import getConversationAction from 'mobile/actions/app/getConversation';
import sendMessageAction from 'mobile/actions/app/sendMessage';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { Colors } from 'mobile/styles/colors';
import Socket from 'mobile/utils/Socket';
import ActionSheet from 'mobile/components/shared/ActionSheet';
import { TypingAnimation } from 'react-native-typing-animation';

type ExtraData = {|
  showOtherUserTyping: boolean,
  otherUserName: string,
  loadingMessages: boolean
|};

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type ReduxProps = {
  getConversation_inProgress: boolean,
  profileMap: { [userId: number]: UserProfile },
  messages: GiftedChatMessage[]
};

type DispatchProps = {
  getConversation: (userId: number, mostRecentMessageId?: number) => void,
  sendMessage: (userId: number, message: GiftedChatMessage) => void
};

type Props = ReduxProps & NavigationProps & DispatchProps;

type State = {|
  match: Match,
  nextTyping: ?Date,
  showOtherUserTyping: boolean,
  lastRecievedTyping: ?Date,
  showFailedMessageActionSheet: boolean,
  selectedMessage: ?GiftedChatMessage
|};

const wrapperBase = {
  backgroundColor: Colors.White,
  borderWidth: 1.5,
  margin: 3
};

const cornersBase = {
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  borderBottomLeftRadius: 15,
  borderBottomRightRadius: 15
};
const BubbleStyles = StyleSheet.create({
  wrapperLeft: {
    ...wrapperBase,
    borderColor: Colors.Grey80
  },
  wrapperRight: {
    ...wrapperBase,
    borderColor: Colors.AquaMarine
  },
  wrapperFailed: {
    ...wrapperBase,
    borderColor: Colors.Grapefruit
  },
  messageText: {
    ...textStyles.subtitle1Style,
    color: Colors.Black
  },
  timeText: {
    fontSize: 10
  },
  tickStyle: {
    color: Colors.Black
  },
  containerRight: {
    ...cornersBase,
    borderBottomRightRadius: 0
  },
  containerLeft: {
    ...cornersBase,
    borderBottomLeftRadius: 0
  }
});

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  const { navigation } = ownProps;
  const match: ?Match = navigation.getParam('match', null);
  if (match === null || match === undefined) {
    throw new Error('Match null or undefined in Messaging Screen');
  }
  const { userId } = match;

  const confirmedConversation = reduxState.confirmedConversations[userId];
  const unconfirmedConversation = reduxState.unconfirmedConversations[userId];

  // Map over unsent messages, mark createdAt as null (as not sent yet)
  // and mark sent as false (as not sent yet), and failed for styling
  const failedMessages = unconfirmedConversation
    ? unconfirmedConversation.failedIds
        .map(uuid => {
          const message = unconfirmedConversation.byId[uuid];
          return {
            ...message,
            createdAt: null,
            sent: false,
            failed: true
          };
        })
        .reverse()
    : [];

  // Map over unsent messages, mark createdAt as null (as not sent yet)
  // and mark sent as false (as not sent yet)
  const inProgressMessages = unconfirmedConversation
    ? unconfirmedConversation.inProgressIds
        .map(uuid => {
          const message = unconfirmedConversation.byId[uuid];
          return {
            ...message,
            createdAt: null,
            sent: false,
            failed: false
          };
        })
        .reverse()
    : [];

  // map over messages, convert to a GiftedMessage
  const sentMessages = confirmedConversation
    ? confirmedConversation.allIds
        .map(id => {
          // TODO: consider have render function of bubble be redux-smart, so it only access the actual object
          const message = confirmedConversation.byId[id];
          return {
            _id: message.messageId.toString(),
            text: message.content,
            createdAt: Date.parse(message.timestamp),
            user: {
              _id: message.fromClient ? '1' : '2',
              name: message.fromClient ? 'A' : 'B'
            },
            sent: true,
            failed: false
          };
        })
        .reverse()
    : [];

  const messages = [...failedMessages, ...inProgressMessages, ...sentMessages];
  return {
    getConversation_inProgress: reduxState.inProgress.getConversation[userId],
    messages,
    profileMap: reduxState.profiles
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getConversation: (userId: number, mostRecentMessageId?: number) => {
      dispatch(getConversationAction(userId, mostRecentMessageId));
    },
    sendMessage: (userId: number, message: GiftedChatMessage) => {
      dispatch(sendMessageAction(userId, message));
    }
  };
}

class MessagingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = props;
    const match: ?Match = navigation.getParam('match', null);
    if (match === null || match === undefined) {
      throw new Error('Match null or undefined in Messaging Screen');
    }
    this.state = {
      match,
      nextTyping: null,
      showOtherUserTyping: false,
      lastRecievedTyping: null,
      showFailedMessageActionSheet: false,
      selectedMessage: null
    };
    Socket.subscribeToTyping(match.userId, () => {
      const date = new Date();
      this.setState({
        showOtherUserTyping: true,
        lastRecievedTyping: date
      });
      setTimeout(() => {
        const { lastRecievedTyping } = this.state;

        // Technically this can call set state AFTER unmounting
        // because we don't check. But because we unsubscribe
        // when unmounting, we are gaurenteed a finite amount of
        // these occur, so it's fine to have the no-op.
        if (lastRecievedTyping === date) {
          this.setState({
            showOtherUserTyping: false
          });
        }
      }, 2500);
    });
  }

  componentDidMount() {
    const { match } = this.state;
    const { getConversation } = this.props;
    getConversation(match.userId);
  }

  // unsubscribe on unmount so we don't attempt to set the state of this component
  componentWillUnmount() {
    Socket.unsubscribeFromTyping();
  }

  _renderBubble = (props: { currentMessage: GiftedChatMessage }) => {
    const { currentMessage } = props;
    const { failed = false } = currentMessage;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: failed
            ? BubbleStyles.wrapperFailed
            : BubbleStyles.wrapperRight,
          left: BubbleStyles.wrapperLeft
        }}
        textStyle={{
          right: BubbleStyles.messageText,
          left: BubbleStyles.messageText
        }}
        timeTextStyle={{
          right: BubbleStyles.timeText,
          left: BubbleStyles.timeText
        }}
        containerToNextStyle={{
          right: BubbleStyles.containerRight,
          left: BubbleStyles.containerLeft
        }}
        containerToPreviousStyle={{
          right: BubbleStyles.containerRight,
          left: BubbleStyles.containerLeft
        }}
        tickStyle={BubbleStyles.tickStyle}
        onPress={() => {
          if (failed) {
            this._toggleFailedMessageActionSheet(true, currentMessage);
          } else {
            Alert.alert('TODO: Allow interacting with old messages');
          }
        }}
      />
    );
  };

  _onSend = (messages: GiftedChatMessage[] = []) => {
    if (messages.length !== 1) {
      throw new Error('tried to send more than one message. WTF??');
    }
    const message = messages[0];
    const { sendMessage } = this.props;
    const { match } = this.state;
    sendMessage(match.userId, message);
  };

  _onInputTextChanged = text => {
    if (!text) {
      return;
    }
    const { match, nextTyping } = this.state;
    const now = new Date();

    if (!nextTyping || now > nextTyping) {
      const twoSecondsFromNow = new Date(now.getTime() + 2000);
      Socket.typing(match.userId);
      this.setState({
        nextTyping: twoSecondsFromNow
      });
    }
  };

  _renderSystemMessage = props => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15
        }}
        textStyle={{
          fontSize: 14
        }}
      />
    );
  };

  _renderContent = (profile: UserProfile) => {
    const { messages, getConversation_inProgress } = this.props;
    const { showOtherUserTyping } = this.state;
    const shouldRenderGenesis =
      messages === null || messages === undefined || messages.length === 0;
    const extraData: ExtraData = {
      showOtherUserTyping,
      otherUserName: profile.fields.displayName,
      loadingMessages: getConversation_inProgress
    };
    return (
      <GiftedChat
        /* If we want to render our genesis text, we need to supply a dummy
        element for the listview. Because of the strict render method of GiftedChat,
        this element must match the GiftedChat Message type */
        messages={
          !shouldRenderGenesis
            ? messages
            : [
                ({
                  _id: 'GENESIS_ID',
                  text: '',
                  createdAt: new Date(),
                  system: true,
                  sent: true,
                  failed: false
                }: GiftedChatMessage)
              ]
        }
        onSend={this._onSend}
        user={{
          _id: '1' // sent messages should have same user._id
        }}
        onInputTextChanged={this._onInputTextChanged}
        renderBubble={this._renderBubble}
        renderFooter={this._renderOtherUserTyping}
        renderChatFooter={this._renderChatLoading}
        renderSystemMessage={this._renderSystemMessage}
        extraData={extraData}
        renderMessage={
          shouldRenderGenesis
            ? () => {
                return this._renderGenesis(profile);
              }
            : null
        }
        renderAvatar={null}
        minInputToolbarHeight={50}
        alignTop
        renderSend={(props: any) => {
          return (
            <TouchableOpacity
              style={{
                width: 45,
                height: 50,
                paddingTop: 10,
                paddingRight: 15
              }}
              onPress={() => {
                const text: string = props.text.trim();
                if (text.length > 0) {
                  props.onSend({ text }, true);
                }
              }}
            >
              <CustomIcon name={'send'} size={30} color="black" />
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  _goToProfile = (profile: UserProfile) => {
    const { navigation } = this.props;
    navigation.navigate(routes.MatchesExpandedCard, {
      profile,
      onMinimize: NavigationService.back
    });
  };

  _renderGenesis = (profile: UserProfile) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 54 }}>
        <TouchableOpacity
          onPress={() => {
            this._goToProfile(profile);
          }}
        >
          <Avatar size={'Large'} photoId={profile.photoIds[0]} border />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 84, paddingVertical: 20 }}>
          <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
            {'Late-night Espresso’s run? ;)'}
          </Text>
        </View>
      </View>
    );
  };

  // Fake a button. Easier to do it this way than to try and mock an actual button because
  // the internal animation must be absolutely positioned.
  _renderOtherUserTyping = ({ extraData }: { extraData: ExtraData }) => {
    const { showOtherUserTyping } = extraData;
    if (!showOtherUserTyping) {
      return null;
    }
    return (
      <View
        style={[
          BubbleStyles.containerLeft,
          wrapperBase,
          {
            borderColor: Colors.Grey80,
            marginLeft: 10,
            height: 40,
            top: -8,
            width: 72,
            paddingLeft: 18
          }
        ]}
      >
        <TypingAnimation
          dotColor={Colors.Black}
          dotMargin={7}
          dotAmplitude={4}
          dotSpeed={0.15}
          dotRadius={3.5}
          dotX={11}
          dotY={12}
        />
      </View>
    );
  };

  _renderChatLoading = ({ extraData }: { extraData: ExtraData }) => {
    if (extraData.loadingMessages) {
      return <ActivityIndicator />;
    }
    return null;
  };

  _toggleFailedMessageActionSheet = (
    showFailedMessageActionSheet: boolean,
    selectedMessage?: GiftedChatMessage
  ) => {
    this.setState({
      showFailedMessageActionSheet,
      selectedMessage: selectedMessage || null
    });
  };

  render() {
    const { profileMap } = this.props;
    const { match, showFailedMessageActionSheet, selectedMessage } = this.state;
    const profile = profileMap[match.userId];
    return (
      <View style={{ flex: 1 }}>
        <View>
          <GEMHeader
            title={profile.fields.displayName}
            leftIconName="back"
            rightIconName="ellipsis"
            onRightIconPress={() => {
              Alert.alert('this should be report and stuff?');
            }}
            borderBottom
            onTitlePress={() => this._goToProfile(profile)}
          />
        </View>
        {this._renderContent(profile)}
        <ActionSheet
          visible={showFailedMessageActionSheet}
          options={[
            {
              text: 'Resend',
              onPress: () => {
                this.setState({ showFailedMessageActionSheet: false }, () => {
                  if (!selectedMessage) {
                    throw new Error('no message during resend');
                  }
                  this._onSend([selectedMessage]);
                });
              }
            },
            {
              text: "Don't Send",
              onPress: () => {
                this.setState({ showFailedMessageActionSheet: false }, () => {
                  if (!selectedMessage) {
                    throw new Error("no message during don't send");
                  }
                  Alert.alert('deleting failed message not yet implemented');
                });
              }
            }
          ]}
          cancel={{
            text: 'Cancel',
            onPress: () => {
              this._toggleFailedMessageActionSheet(false);
            }
          }}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
