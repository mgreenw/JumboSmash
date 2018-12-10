// @flow
import React from "react";
import { View, TouchableOpacity } from "react-native";
import type { UserProfile, Candidate } from "mobile/reducers";
import { EmptyIcon, HeaderIcon } from "./HeaderIcon";
import { Header } from "react-native-elements";
import { textStyles } from "mobile/styles/textStyles";

import { routes } from "mobile/components/Navigation";
import NavigationService from "mobile/NavigationService";

type Props = {
  screen: "profile" | "cards" | "matches",
  onLeftIconPress?: () => void,
  onRightIconPress?: () => void
};

type State = {};

export default class GEMHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    // TODO: make this styling via a style sheet, and better!
    return (
      <Header
        placement="center"
        backgroundColor="transparent"
        leftComponent={
          this.props.screen === "profile" ? (
            <EmptyIcon />
          ) : this.props.screen === "cards" ? (
            <HeaderIcon
              name="user"
              onPress={
                this.props.onLeftIconPress
                  ? this.props.onLeftIconPress
                  : () => NavigationService.navigate(routes.Profile)
              }
            />
          ) : (
            <HeaderIcon
              name="cards"
              onPress={
                this.props.onLeftIconPress
                  ? this.props.onLeftIconPress
                  : () => NavigationService.navigate(routes.Cards)
              }
            />
          )
        }
        rightComponent={
          this.props.screen === "profile" ? (
            <HeaderIcon
              name="cards"
              onPress={
                this.props.onRightIconPress
                  ? this.props.onRightIconPress
                  : () => NavigationService.navigate(routes.Cards)
              }
            />
          ) : this.props.screen === "cards" ? (
            <HeaderIcon
              name="message"
              onPress={
                this.props.onRightIconPress
                  ? this.props.onRightIconPress
                  : () => NavigationService.navigate(routes.Matches)
              }
            />
          ) : (
            <EmptyIcon />
          )
        }
        centerComponent={{
          text: this.props.screen,
          style: textStyles.headline5Style
        }}
        outerContainerStyles={{ borderBottomWidth: 0 }}
      />
    );
  }
}
