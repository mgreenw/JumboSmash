// @flow

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import ActionSheet from 'mobile/components/shared/ActionSheet';
import Popup from 'mobile/components/shared/Popup';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { SecondaryButton } from 'mobile/components/shared/buttons/SecondaryButton';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { NavigationScreenProp } from 'react-navigation';
import routes from 'mobile/components/navigation/routes';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import getConversationAction from 'mobile/actions/app/getConversation';
import sendMessageAction from 'mobile/actions/app/sendMessage';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';

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

type State = {
  match: Match,
  messagesLoaded: boolean,
  showActionSheet: boolean,
  showPopup: boolean,
  block: boolean,
  selectedReasons: boolean[]
};

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
  // and mark sent as false (as not sent yet)
  const unsentMessages = unconfirmedConversation
    ? unconfirmedConversation.allIds
        .map(uuid => {
          const message = unconfirmedConversation.byId[uuid];
          return {
            ...message,
            createdAt: null,
            sent: false
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
            sent: true
          };
        })
        .reverse()
    : [];

  const messages = unsentMessages.concat(sentMessages);

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

const COMMON_REASONS = [
  'Made me uncomfortable',
  'Abusive or threatening',
  'Inappropriate content',
  'Bad offline behavior'
];

const BLOCK_REASONS = [...COMMON_REASONS, 'No reason'];
const REPORT_REASONS = [...COMMON_REASONS, 'Spam or scam'];

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
      messagesLoaded: false,
      showActionSheet: false,
      showPopup: false,
      block: false,
      selectedReasons: []
    };
  }

  componentDidMount() {
    const { match } = this.state;
    const { getConversation } = this.props;
    getConversation(match.userId);
  }

  componentDidUpdate(prevProps: Props) {
    const { getConversation_inProgress } = this.props;
    if (prevProps.getConversation_inProgress && !getConversation_inProgress) {
      // We're doing this safely
      /* eslint-disable-next-line react/no-did-update-set-state */
      this.setState({
        messagesLoaded: true
      });
    }
  }

  _toggleActionSheet = (showActionSheet: boolean) => {
    this.setState({ showActionSheet });
  };

  _toggleShowPopup = (showPopup: boolean, block: boolean) => {
    this.setState({ showPopup, block });
  };

  onSend = (messages: GiftedChatMessage[] = []) => {
    if (messages.length !== 1) {
      throw new Error('tried to send more than one message. WTF??');
    }
    const message = messages[0];
    const { sendMessage } = this.props;
    const { match } = this.state;
    sendMessage(match.userId, message);
  };

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0'
          }
        }}
      />
    );
  };

  renderSystemMessage = props => {
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

  // for when we have typing text
  renderFooter = () => {
    return null;
  };

  _renderContent = () => {
    const { messages } = this.props;
    if (messages === null || messages === undefined) {
      return this._renderGenisis();
    }
    return (
      <GiftedChat
        messages={messages}
        onSend={this.onSend}
        user={{
          _id: '1' // sent messages should have same user._id
        }}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        renderFooter={this.renderFooter}
        renderAvatar={null}
        minInputToolbarHeight={50}
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

  _renderGenisis = () => {
    const { navigation, profileMap } = this.props;
    const { match } = this.state;
    const profile = profileMap[match.userId];
    return (
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 54 }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.MatchesExpandedCard, {
              profile,
              onMinimize: NavigationService.back
            })
          }
        >
          <Avatar size={'Large'} photoId={profile.photoIds[0]} border />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 84, paddingTop: 20 }}>
          <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
            {'Late-night Espresso’s run? ;)'}
          </Text>
        </View>
      </View>
    );
  };

  _renderActionSheet() {
    const { showActionSheet } = this.state;
    return (
      <ActionSheet
        visible={showActionSheet}
        options={[
          {
            text: 'Block',
            onPress: () => {
              this._toggleActionSheet(false);
              this._toggleShowPopup(true, true);
            },
            textStyle: {
              color: Colors.Grapefruit
            }
          },
          {
            text: 'Report',
            onPress: () => {
              this._toggleActionSheet(false);
              this._toggleShowPopup(true, false);
            },
            textStyle: {
              color: Colors.Grapefruit
            }
          }
        ]}
        cancel={{
          text: 'Cancel',
          onPress: () => {
            this._toggleActionSheet(false);
          }
        }}
      />
    );
  }

  _renderPopup() {
    const { showPopup, match, block, selectedReasons } = this.state;
    const { profileMap } = this.props;
    const profile = profileMap[match.profile];
    const displayName = profile.fields.displayName;

    const reasons = block ? BLOCK_REASONS : REPORT_REASONS;

    return (
      <Popup
        visible={showPopup}
        onTouchOutside={() => this._toggleShowPopup(false, false)}
      >
        <Text
          style={[
            textStyles.headline4StyleMedium,
            {
              color: Colors.Grapefruit,
              textAlign: 'center'
            }
          ]}
        >
          {block ? 'Block' : 'Report'}
        </Text>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {`Help keep JumboSmash safe by telling the team why you’re ${
            block ? 'blocking' : 'reporting'
          } ${displayName}.`}
        </Text>
        {reasons.map((reason, i) => {
          const checked = selectedReasons[i];
          return (
            <View style={{ flexDirection: 'row', marginTop: 22 }} key={reason}>
              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  borderColor: Colors.AquaMarine,
                  borderWidth: 2,
                  borderRadius: 32,
                  paddingTop: 1.5,
                  marginRight: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: checked ? Colors.AquaMarine : Colors.White
                }}
                onPress={() => {
                  const newSelectedReasons = selectedReasons;
                  newSelectedReasons[i] = !checked;
                  this.setState({ selectedReasons: newSelectedReasons });
                }}
              >
                <CustomIcon name="check" size={16} color={Colors.White} />
              </TouchableOpacity>
              <Text style={textStyles.headline6Style}>{reason}</Text>
            </View>
          );
        })}
        <View style={{ flexDirection: 'row', marginTop: 31 }}>
          <View style={{ flex: 1, paddingRight: 30 }}>
            <SecondaryButton
              onPress={() => this._toggleShowPopup(false, false)}
              title="Cancel"
              loading={false}
              disabled={false}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              onPress={() => console.log('Pressed block/report')}
              title={block ? 'Block' : 'Report'}
              loading={false}
              disabled={false}
            />
          </View>
        </View>
      </Popup>
    );
  }

  render() {
    const { messagesLoaded } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View>
          <GEMHeader
            title="Messages"
            leftIconName="back"
            rightIconName="ellipsis"
            onRightIconPress={() => this._toggleActionSheet(true)}
            borderBottom
          />
        </View>
        {messagesLoaded ? (
          this._renderContent()
        ) : (
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center'
            }}
          >
            <ActivityIndicator />
          </View>
        )}
        {this._renderActionSheet()}
        {this._renderPopup()}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
