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
import instantiateEmojiRegex from 'emoji-regex';
import type {
  ReduxState,
  Dispatch,
  Match,
  GiftedChatMessage,
  UserProfile
} from 'mobile/reducers/index';
import GEMHeader from 'mobile/components/shared/Header';
import Avatar from 'mobile/components/shared/Avatar';
import { type NavigationScreenProp } from 'react-navigation';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import getConversationAction from 'mobile/actions/app/getConversation';
import sendMessageAction from 'mobile/actions/app/sendMessage';
import readMessageAction from 'mobile/actions/app/readMessage';
import cancelFailedMessageAction from 'mobile/actions/app/cancelFailedMessage';
import {
  GiftedChat,
  Bubble,
  SystemMessage,
  Message
} from 'react-native-gifted-chat';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { Colors } from 'mobile/styles/colors';
import Socket from 'mobile/utils/Socket';
import ActionSheet from 'mobile/components/shared/ActionSheet';
import { TypingAnimation } from 'react-native-typing-animation';
import ModalProfileView from 'mobile/components/shared/ModalProfileView';
import formatMessage from 'mobile/utils/FormatMessage';
import { isIphoneX } from 'mobile/utils/Platform';
import BlockPopup from './BlockPopup';
import ReportPopup from './ReportPopup';
import UnmatchPopup from './UnmatchPopup';

const emojiRegex = instantiateEmojiRegex();

/**
 *
 * @param {string} content Message Text
 * @returns {boolean} if the message all emojis, 3 or less.
 * Terminates early if the message is longer than 6 characters,
 * because emojis can only be about 10 .
 */
function shouldDisplayLargeMessage(content: string): boolean {
  if (content.length > 30) {
    return false;
  }
  const onlyEmojis = content.replace(emojiRegex, '').trim() === '';
  const numberOfEmojis = (content.match(emojiRegex) || []).length;
  return onlyEmojis && numberOfEmojis <= 3;
}

/**
 *
 * @param {newestMessage} accumulator for reduce function
 * @param {currentMessage} element for reduce function
 * Reduce function for computing the most recent non-client message from a list of messages.
 */
const newerMessage = (
  newestMessage: ?GiftedChatMessage,
  currentMessage: ?GiftedChatMessage
) => {
  // Don't use client messages
  if (
    currentMessage &&
    currentMessage.user &&
    currentMessage.user._id === 'client'
  ) {
    return newestMessage;
  }

  // If we don't have a current message, use any available.
  if (currentMessage && !newestMessage) {
    return currentMessage;
  }

  // main check: compare timestamps, return newer one.
  if (
    newestMessage &&
    newestMessage.createdAt &&
    currentMessage &&
    currentMessage.createdAt &&
    newestMessage.createdAt < currentMessage.createdAt
  ) {
    return currentMessage;
  }

  // default to just returning current one if fields are null.
  return newestMessage;
};

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
  messages: GiftedChatMessage[],
  mostRecentSenderMessageId: ?number
};

type DispatchProps = {
  getConversation: (userId: number, mostRecentMessageId?: number) => void,
  sendMessage: (userId: number, message: GiftedChatMessage) => void,
  readMessage: (userId: number, message: number) => void,
  cancelFailedMessage: (userId: number, messagedUuid: string) => void
};

type Props = ReduxProps & NavigationProps & DispatchProps;

type State = {|
  match: Match,
  nextTyping: ?Date,
  showOtherUserTyping: boolean,
  lastRecievedTyping: ?Date,
  showFailedMessageActionSheet: boolean,
  selectedMessage: ?GiftedChatMessage,
  showUserActionSheet: boolean,
  showBlockPopup: boolean,
  showReportPopup: boolean,
  showUnmatchPopup: boolean,
  showExpandedCard: boolean,
  mostRecentlyReadMessageId: ?number
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
  wrapperLarge: {
    ...wrapperBase,
    borderWidth: 0,
    margin: 0
  },
  wrapperFailed: {
    ...wrapperBase,
    borderColor: Colors.Grapefruit
  },
  messageTextNormal: {
    ...textStyles.subtitle1Style,
    color: Colors.Black
  },
  messageTextLarge: {
    ...textStyles.subtitle1Style,
    color: Colors.Black,
    fontSize: 70,
    lineHeight: 85,
    marginBottom: -10
  },
  timeText: {
    fontSize: 10,
    lineHeight: 12
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
  const readReceipt = reduxState.readReceipts[userId];

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
            failed: true,
            displayLarge: shouldDisplayLargeMessage(message.text)
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
            failed: false,
            displayLarge: shouldDisplayLargeMessage(message.text)
          };
        })
        .reverse()
    : [];

  const _confirmedIdToMessage = id => {
    // TODO: consider have render function of bubble be redux-smart, so it only access the actual object
    const message = confirmedConversation.byId[id];

    const giftedChatMessage: GiftedChatMessage = {
      _id: message.messageId.toString(),
      text: formatMessage(message.content),
      createdAt: Date.parse(message.timestamp),
      user: {
        _id: message.sender,
        name: message.sender
      },
      system: message.sender === 'system',
      displayLarge: shouldDisplayLargeMessage(message.content),
      sent: true,
      failed: false,
      received: readReceipt
        ? readReceipt.readAtTimestamp >= message.timestamp
        : false
    };
    return giftedChatMessage;
  };

  // map over messages, convert to a GiftedMessage
  const inOrderMessages: GiftedChatMessage[] = confirmedConversation
    ? confirmedConversation.inOrderIds.map(_confirmedIdToMessage).reverse()
    : [];
  const outOfOrderMessages: GiftedChatMessage[] = confirmedConversation
    ? confirmedConversation.outOfOrderIds.map(_confirmedIdToMessage).reverse()
    : [];

  const messages: GiftedChatMessage[] = [
    ...failedMessages,
    ...inProgressMessages,
    ...outOfOrderMessages,
    ...inOrderMessages
  ];

  const newestOutOfOrderMessage: ?GiftedChatMessage = outOfOrderMessages.reduceRight(
    newerMessage,
    null
  );

  const newestInOrderMessage: ?GiftedChatMessage = inOrderMessages.find(
    (message: GiftedChatMessage) =>
      message.user && message.user._id !== 'client'
  );

  const newestMessage: ?GiftedChatMessage = newerMessage(
    newestInOrderMessage,
    newestOutOfOrderMessage
  );

  return {
    getConversation_inProgress: reduxState.inProgress.getConversation[userId],
    messages,
    profileMap: reduxState.profiles,
    mostRecentSenderMessageId: newestMessage
      ? parseInt(newestMessage._id, 10)
      : null
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getConversation: (userId: number) => {
      dispatch(getConversationAction(userId));
    },
    sendMessage: (userId: number, message: GiftedChatMessage) => {
      dispatch(sendMessageAction(userId, message));
    },
    readMessage: (userId: number, messageId: number) => {
      dispatch(readMessageAction(userId, messageId));
    },
    cancelFailedMessage: (userId: number, messageUuid: string) => {
      dispatch(cancelFailedMessageAction(userId, messageUuid));
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
      selectedMessage: null,
      showUserActionSheet: false,
      showBlockPopup: false,
      showReportPopup: false,
      showUnmatchPopup: false,
      showExpandedCard: false,
      mostRecentlyReadMessageId: null
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

  componentDidUpdate() {
    const { mostRecentSenderMessageId: newId, readMessage } = this.props;
    const { mostRecentlyReadMessageId: oldId, match } = this.state;

    if (newId && newId !== oldId) {
      // TODO: offload this kind of check to the action.
      // If read message fails then no retries will occur untill component is remounted, or a new message comes in.
      // However, both of those happen a lot! and can be triggered by revisiting the screen, so all safe for now.
      this.setState({
        mostRecentlyReadMessageId: newId
      });
      readMessage(match.userId, newId);
    }
  }

  // unsubscribe on unmount so we don't attempt to set the state of this component
  componentWillUnmount() {
    Socket.unsubscribeFromTyping();
  }

  _renderBubble = (props: { currentMessage: GiftedChatMessage }) => {
    const { currentMessage } = props;
    const { failed = false } = currentMessage;
    const { displayLarge = false } = currentMessage;

    let rightWrapperStyle = BubbleStyles.wrapperRight;
    if (failed) rightWrapperStyle = BubbleStyles.wrapperFailed;
    else if (displayLarge) rightWrapperStyle = BubbleStyles.wrapperLarge;

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: rightWrapperStyle,
          left: displayLarge
            ? BubbleStyles.wrapperLarge
            : BubbleStyles.wrapperLeft
        }}
        textStyle={{
          right:
            displayLarge && !failed
              ? BubbleStyles.messageTextLarge
              : BubbleStyles.messageTextNormal,
          left:
            displayLarge && !failed
              ? BubbleStyles.messageTextLarge
              : BubbleStyles.messageTextNormal
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

    // If all messages are system messages, show genesis text!
    const shouldRenderGenesisText = !messages.find(m => m.system === false);
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
        messages={[
          ...messages,
          ({
            _id: 'GENESIS_ID',
            text: '',
            createdAt: new Date(),
            system: true,
            sent: true,
            failed: false
          }: GiftedChatMessage)
        ]}
        onSend={this._onSend}
        user={{
          _id: 'client' // sent messages should have same user._id
        }}
        onInputTextChanged={this._onInputTextChanged}
        renderBubble={this._renderBubble}
        renderFooter={this._renderOtherUserTyping}
        renderChatFooter={this._renderChatLoading}
        renderSystemMessage={this._renderSystemMessage}
        extraData={extraData}
        renderMessage={m => {
          if (m.currentMessage._id === 'GENESIS_ID') {
            return this._renderGenesis(profile, shouldRenderGenesisText);
          }
          return <Message {...m} />;
        }}
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

  _showExpandedCard = () => {
    this.setState({
      showExpandedCard: true
    });
  };

  _hideExpandedCard = () => {
    this.setState({
      showExpandedCard: false
    });
  };

  _renderGenesis = (profile: UserProfile, shouldRenderGenesisText: boolean) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 54 }}>
        <TouchableOpacity
          onPress={() => {
            this._showExpandedCard();
          }}
        >
          <Avatar size={'Large'} photoUuid={profile.photoUuids[0]} border />
        </TouchableOpacity>
        {shouldRenderGenesisText && (
          <Text
            style={[
              textStyles.headline5Style,
              {
                textAlign: 'center',
                paddingHorizontal: 84,
                paddingVertical: 20
              }
            ]}
          >
            {'Late-night Espresso’s run? ;)'}
          </Text>
        )}
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

  _toggleUserActionSheet = (showUserActionSheet: boolean) => {
    this.setState({ showUserActionSheet });
  };

  _renderUserActionSheet() {
    const { showUserActionSheet } = this.state;
    return (
      <ActionSheet
        visible={showUserActionSheet}
        options={[
          {
            text: 'View Profile',
            onPress: () => {
              this.setState({ showUserActionSheet: false });
              this._showExpandedCard();
            }
          },
          {
            text: 'Unmatch',
            onPress: () => {
              this.setState({
                showUserActionSheet: false,
                showUnmatchPopup: true
              });
            }
          },
          {
            text: 'Block',
            onPress: () => {
              this.setState({
                showUserActionSheet: false,
                showBlockPopup: true
              });
            },
            textStyle: {
              color: Colors.Grapefruit
            }
          },
          {
            text: 'Report',
            onPress: () => {
              this.setState({
                showUserActionSheet: false,
                showReportPopup: true
              });
            },
            textStyle: {
              color: Colors.Grapefruit
            }
          }
        ]}
        cancel={{
          text: 'Cancel',
          onPress: () => {
            this._toggleUserActionSheet(false);
          }
        }}
      />
    );
  }

  _renderBlockPopup() {
    const { showBlockPopup, match } = this.state;
    const { profileMap } = this.props;
    const profile = profileMap[match.profile];
    const displayName = profile.fields.displayName;

    return (
      <BlockPopup
        visible={showBlockPopup}
        onCancel={() => this.setState({ showBlockPopup: false })}
        onDone={() =>
          this.setState({ showBlockPopup: false }, () =>
            NavigationService.back()
          )
        }
        displayName={displayName}
        userId={match.profile}
      />
    );
  }

  _renderReportPopup() {
    const { showReportPopup, match } = this.state;
    const { profileMap } = this.props;
    const profile = profileMap[match.profile];
    const displayName = profile.fields.displayName;

    return (
      <ReportPopup
        visible={showReportPopup}
        onCancel={() => this.setState({ showReportPopup: false })}
        onDone={block =>
          this.setState(
            { showReportPopup: false },
            () => block && NavigationService.back()
          )
        }
        displayName={displayName}
        userId={match.profile}
      />
    );
  }

  _renderUnmatchPopup() {
    const { showUnmatchPopup, match } = this.state;
    const { profileMap } = this.props;
    const profile = profileMap[match.profile];
    const displayName = profile.fields.displayName;

    return (
      <UnmatchPopup
        visible={showUnmatchPopup}
        onCancel={() => this.setState({ showUnmatchPopup: false })}
        onDone={() =>
          this.setState({ showUnmatchPopup: false }, () =>
            NavigationService.back()
          )
        }
        displayName={displayName}
        matchId={match.profile}
      />
    );
  }

  render() {
    const { profileMap, cancelFailedMessage } = this.props;
    const {
      match,
      showFailedMessageActionSheet,
      selectedMessage,
      showExpandedCard
    } = this.state;
    const profile = profileMap[match.userId];
    const padBottom = isIphoneX();
    return (
      <View style={{ flex: 1 }}>
        <View>
          <GEMHeader
            title={profile.fields.displayName}
            leftIconName="back"
            rightIconName="ellipsis"
            onRightIconPress={() => this._toggleUserActionSheet(true)}
            borderBottom
            onTitlePress={() => this._showExpandedCard()}
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
                  cancelFailedMessage(match.userId, selectedMessage._id);
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
        {padBottom && <View style={{ height: 20 }} />}
        <ModalProfileView
          isVisible={showExpandedCard}
          onSwipeComplete={this._hideExpandedCard}
          onBlockReport={() => {
            this.setState(
              {
                showExpandedCard: false
              },
              () => {
                this._toggleUserActionSheet(true);
              }
            );
          }}
          onMinimize={() => {
            this.setState({
              showExpandedCard: false
            });
          }}
          profile={profile}
        />
        {this._renderUserActionSheet()}
        {this._renderBlockPopup()}
        {this._renderReportPopup()}
        {this._renderUnmatchPopup()}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
