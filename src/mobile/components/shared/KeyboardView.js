// @flow

// Use this component for a wrapper around screens that need
// keybaords; it will handle the keyboard avoiding view AND the dismissing

import * as React from "react"; // need this format to access children
import {
  Image,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";

const waves1 = require("../../assets/waves/waves1/waves.png");

type Props = {
  waves?: 1,
  children?: React.Node
};

type State = {};

export class KeyboardView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <KeyboardAvoidingView style={Arthur_Styles.container} behavior="padding">
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View style={{ flex: 1 }}>{this.props.children}</View>
        </TouchableWithoutFeedback>
        {this.props.waves && (
          <Image
            resizeMode="stretch"
            source={waves1}
            style={Arthur_Styles.waves}
          />
        )}
      </KeyboardAvoidingView>
    );
  }
}
