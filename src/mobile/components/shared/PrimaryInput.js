// @flow
import React from "react";
import { View, Keyboard } from "react-native";
import { Input } from "react-native-elements";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { textStyles } from "mobile/styles/textStyles";

type Props = {
  placeholder: string,
  label: string,
  assitive: string,
  error: string,
  onChangeText: (text: string) => void,
  setRef: (input: Input) => void
};

type State = {};

export class PrimaryInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Input
        label={this.props.label}
        placeholder={this.props.placeholder}
        onChangeText={this.props.onChangeText}
        ref={this.props.setRef}
        errorMessage={this.props.error || this.props.assitive}
        autoCorrect={false}
        autoCapitalize="none"
        inputStyle={textStyles.headline6Style}
        errorStyle={textStyles.body2Style}
      />
    );
  }
}
