// @flow
import React from "react";
import { Input } from "react-native-elements";
import type { Dispatch } from "redux";

type Props = {
  placeholder: string,
  value: string,
  onChangeText: (bio: string) => void
};

type State = {};

export default class BioInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Input
        multiline={true}
        placeholder={this.props.placeholder}
        onChangeText={bio => this.props.onChangeText(bio)}
        value={this.props.value}
      />
    );
  }
}
