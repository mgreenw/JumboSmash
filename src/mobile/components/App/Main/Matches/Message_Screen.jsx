// @flow

import React from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
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
  messagesLoaded: boolean
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
      messagesLoaded: false
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

  _renderContent = (profile: UserProfile) => {
    const { messages } = this.props;
    const shouldRenderGenesis =
      messages === null || messages === undefined || messages.length === 0;
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
                  sent: true
                }: GiftedChatMessage)
              ]
        }
        onSend={this.onSend}
        user={{
          _id: '1' // sent messages should have same user._id
        }}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
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

  render() {
    const { profileMap } = this.props;
    const { match } = this.state;
    const profile = profileMap[match.userId];
    const { messagesLoaded } = this.state;
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
        {messagesLoaded ? (
          this._renderContent(profile)
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
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
