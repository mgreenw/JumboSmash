// @flow
import React from "react";
import { View, TouchableOpacity } from "react-native";
import type { UserProfile, Candidate } from "mobile/reducers";
import CustomIcon from "mobile/assets/icons/CustomIcon";

type Props = {
  onPress: () => void,
  name: string
};

type State = {};

export default class HeaderIcon extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    // TODO: make this styling via a style sheet, and better!
    return (
      <TouchableOpacity
        style={{
          paddingLeft: 22,
          paddingRight: 22,
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={this.props.onPress}
      >
        <CustomIcon name={this.props.name} size={26} />
      </TouchableOpacity>
    );
  }
}
