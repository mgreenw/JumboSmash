// @flow

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  GiftedChat,
  Bubble,
  SystemMessage,
  InputToolbar
} from "react-native-gifted-chat";

const Messages = require("./data/messages.js");

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  footerText: {
    fontSize: 14,
    color: "#aaa"
  }
});

type Props = {};
type State = {
  messages: any[]
};

export default class Example extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      messages: Messages
    };
  }

  onSend = (messages: any[] = []) => {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages)
      };
    });
  };

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#f0f0f0"
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
    const { typingText } = this.state;
    if (typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{typingText}</Text>
        </View>
      );
    }
    return null;
  };

  render() {
    const { messages } = this.state;
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
  }
}
