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
  Message
} from 'mobile/reducers/index';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import Avatar from 'mobile/components/shared/Avatar';
import type { NavigationScreenProp } from 'react-navigation';
import { routes } from 'mobile/components/Navigation';
import NavigationService from 'mobile/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import getConversationAction from 'mobile/actions/app/getConversation';
import sendMessageAction from 'mobile/actions/app/sendMessage';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  footerText: {
    fontSize: 14,
    color: '#aaa'
  }
});

type GiftedChatUser = {
  _id: string,
  name: string
};

type GiftedChatMessage = {
  _id: string,
  text: string,
  createdAt: Date,
  user: GiftedChatUser
};

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type ReduxProps = {
  getConversation_inProgress: boolean,
  messages: ?(GiftedChatMessage[])
};

type DispatchProps = {
  getConversation: (userId: number, mostRecentMessageId?: string) => void,
  sendMessage: (
    userId: number,
    messageId: string,
    messageContent: string
  ) => void
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
  console.log('get conversation:', reduxState.inProgress.getConversation);
  console.log('conversations:', reduxState.conversations);
  const { userId } = match;
  const conversation = reduxState.conversations[userId];
  return {
    getConversation_inProgress: reduxState.inProgress.getConversation[userId],
    messages: conversation
      ? conversation
          .map(message => {
            return {
              _id: message.messageId,
              text: message.content,
              createdAt: new Date(),
              user: {
                _id: message.fromClient ? 1 : 2,
                name: message.fromClient ? 'A' : 'B'
              }
            };
          })
          .reverse()
      : null
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getConversation: (userId: number, mostRecentMessageId?: string) => {
      dispatch(getConversationAction(userId, mostRecentMessageId));
    },
    sendMessage: (
      userId: number,
      messageId: string,
      messageContent: string
    ) => {
      dispatch(sendMessageAction(userId, messageId, messageContent));
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
      this.setState({
        messagesLoaded: true
      });
    }
  }

  onSend = (messages: GiftedChatMessage[] = []) => {
    console.log('sending messages:', messages);
    if (messages.length !== 1) {
      throw new Error('tried to send more than one message. WTF??');
    }
    const message = messages[0];
    const { sendMessage } = this.props;
    const { match } = this.state;
    sendMessage(match.userId, message._id, message.text);
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

  renderFooter = () => {
    // TODO via socket:
    // const { typingText } = this.state;
    // if (typingText) {
    //   return (
    //     <View style={styles.footerContainer}>
    //       <Text style={styles.footerText}>{typingText}</Text>
    //     </View>
    //   );
    // }
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
          _id: 1 // sent messages should have same user._id
        }}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        renderFooter={this.renderFooter}
      />
    );
  };

  _renderGenisis = () => {
    const { navigation } = this.props;
    const { match } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 54 }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.MatchesExpandedCard, {
              profile: match.profile,
              onMinimize: NavigationService.back
            })
          }
        >
          <Avatar size={'Large'} photoId={match.profile.photoIds[0]} border />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 84, paddingTop: 20 }}>
          <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
            {'Late-night Espresso’s run? ;)'}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const { messagesLoaded } = this.state;
    return (
      <Transition inline appear="right">
        <View style={{ flex: 1 }}>
          <View>
            <GEMHeader
              title="Messages"
              leftIconName="back"
              rightIconName="heart-filled"
              onRightIconPress={() => {
                Alert.alert('this should be report and stuff?');
              }}
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
        </View>
      </Transition>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
