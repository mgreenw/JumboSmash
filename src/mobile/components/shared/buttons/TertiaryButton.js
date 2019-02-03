// @flow
import React from "react";
import { View, Keyboard, Text } from "react-native";
import { textStyles } from "mobile/styles/textStyles";

type Props = {
  onPress: () => void,
  title: string
};

type State = {};

export class TertiaryButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ height: 18 }}>
        <Text
          onPress={() => {
            Keyboard.dismiss(); // in case a keyboard is up, buttons close them
            this.props.onPress();
          }}
          value={this.props.title}
          containerStyle={{ width: "100%" }}
          style={[
            textStyles.body2Style,
            { textAlign: "center", textDecorationLine: "underline" }
          ]}
        >
          {this.props.title}
        </Text>
        )}
      </View>
    );
  }
}
