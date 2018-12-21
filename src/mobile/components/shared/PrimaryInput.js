// @flow
import React from "react";
import { View, Keyboard, Text, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { textStyles } from "mobile/styles/textStyles";
import Hoshi from "./customTextInput/Hoshi";

type Props = {
  placeholder: string,
  label: string,
  assitive: string,
  error: string,
  setRef: (input: Input) => void,
  containerStyle: styles,
  onChange: (value: string) => void
};

type State = {};

export class PrimaryInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <Hoshi
          labelStyle={{
            fontFamily: "SourceSansPro",
            fontSize: 14
          }}
          inputStyle={textStyles.headline6Style}
          label={"UTLN"}
          maskColor={"transparent"}
          onChange={this.props.onChange}
        />
        <View style={{ height: 18, width: "100%" }}>
          <Text
            style={{
              fontFamily: "SourceSansPro",
              fontSize: 14,
              paddingLeft: 7
            }}
          >
            {this.props.assitive}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
