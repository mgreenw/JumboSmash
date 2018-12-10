// @flow
import React from "react";
import { View, TouchableOpacity } from "react-native";
import type { UserProfile, Candidate } from "mobile/reducers";
import CustomIcon from "mobile/assets/icons/CustomIcon";
import NavigationService from "mobile/NavigationService";
import { routes } from "mobile/components/Navigation";

type AbstractIconProps = {
  onPress: () => void,
  name: "user" | "message" | "cards"
};

type State = {};

export class HeaderIcon extends React.Component<AbstractIconProps, State> {
  constructor(props: AbstractIconProps) {
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

type EmptyIconProps = {};

// dummy icon that's empty but takes up same ammount of space
export class EmptyIcon extends React.Component<EmptyIconProps> {
  render() {
    return (
      <View
        style={{
          paddingLeft: 22,
          paddingRight: 22
        }}
      >
        <CustomIcon name={"user"} color={"transparent"} size={26} />
      </View>
    );
  }
}
