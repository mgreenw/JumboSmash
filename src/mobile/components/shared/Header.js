// @flow
import React from "react";
import { View, TouchableOpacity, StatusBar } from "react-native";
import type { UserProfile, Candidate } from "mobile/reducers";
import { HeaderIcon } from "./HeaderIcon";
import { Header } from "react-native-elements";
import { textStyles } from "mobile/styles/textStyles";

import { routes } from "mobile/components/Navigation";

import type { IconName } from "mobile/assets/icons/CustomIcon";
type screen =
  | "profile"
  | "cards"
  | "matches"
  | "onboarding-start"
  | "onboarding-main"
  | "profile-edit";

type Props = {
  screen: screen,
  onLeftIconPress?: () => void,
  onRightIconPress?: () => void,
  loading?: boolean,
  title?: string
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
      case "profile-edit": {
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
      case "profile-edit": {
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
      case "profile-edit": {
        return "Edit Profile";
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

    // terrible sketchy null checks. don't land this code.
    let title = this.props.title || this._screenToTitle(screen);
    if (this.props.title === "") {
      title = "";
    }

    return (
      <View>
        <Header
          placement="center"
          backgroundColor="transparent"
          leftComponent={
            <HeaderIcon
              name={leftIconName}
              disabled={this.props.loading}
              onPress={this.props.onLeftIconPress}
            />
          }
          rightComponent={
            <HeaderIcon
              name={rightIconName}
              disabled={this.props.loading}
              onPress={this.props.onRightIconPress}
            />
          }
          centerComponent={{
            text: title,
            style: textStyles.headline5Style
          }}
          outerContainerStyles={{ borderBottomWidth: 0 }}
        />
        <StatusBar barStyle="dark-content" />
      </View>
    );
  }
}
