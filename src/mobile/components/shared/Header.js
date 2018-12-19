// @flow
import React from "react";
import { View, TouchableOpacity } from "react-native";
import type { UserProfile, Candidate } from "mobile/reducers";
import { HeaderIcon } from "./HeaderIcon";
import { Header } from "react-native-elements";
import { textStyles } from "mobile/styles/textStyles";

import { routes } from "mobile/components/Navigation";

import type { IconName } from "./HeaderIcon";
type screen =
  | "profile"
  | "cards"
  | "matches"
  | "onboarding-start"
  | "onboarding-main";

type Props = {
  screen: screen,
  onLeftIconPress?: () => void,
  onRightIconPress?: () => void,
  loading?: boolean
};

type State = {};

export default class GEMHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _screenToLeftIconName = (screen: screen): ?IconName => {
    switch (screen) {
      case "profile": {
        return null;
      }
      case "cards": {
        return "user";
      }
      case "matches": {
        return "cards";
      }
      case "onboarding-start": {
        return null;
      }
      case "onboarding-main": {
        return "back";
      }
    }
  };

  _screenToRightIconName = (screen: screen): ?IconName => {
    switch (screen) {
      case "profile": {
        return "cards";
      }
      case "cards": {
        return "message";
      }
      case "matches": {
        return null;
      }
      case "onboarding-start": {
        return null;
      }
      case "onboarding-main": {
        return null;
      }
    }
  };

  _screenToTitle = (screen: screen): string => {
    switch (screen) {
      case "profile": {
        return "Profile";
      }
      case "cards": {
        return "Project GEM";
      }
      case "matches": {
        return "Messages";
      }
      case "onboarding-start": {
        return "Profile Setup";
      }
      case "onboarding-main": {
        return "Profile Setup";
      }
      default: {
        throw ("No title found for screen: ", screen);
      }
    }
  };

  render() {
    // TODO: make this styling via a style sheet, and better!
    const { screen } = this.props;
    const rightIconName = this._screenToRightIconName(screen);
    const leftIconName = this._screenToLeftIconName(screen);
    const title = this._screenToTitle(screen);

    return (
      <Header
        placement="center"
        backgroundColor="transparent"
        leftComponent={
          <HeaderIcon name={leftIconName} disabled={this.props.loading} />
        }
        rightComponent={
          <HeaderIcon name={rightIconName} disabled={this.props.loading} />
        }
        centerComponent={{
          text: title,
          style: textStyles.headline5Style
        }}
        outerContainerStyles={{ borderBottomWidth: 0 }}
      />
    );
  }
}
