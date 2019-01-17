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
  leftIconName?: IconName,
  rightIconName?: IconName,
  onLeftIconPress?: () => void,
  onRightIconPress?: () => void,
  title: string,
  loading?: boolean
};

type State = {};

export default class GEMHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    // TODO: make this styling via a style sheet, and better!
    const {
      leftIconName,
      rightIconName,
      onLeftIconPress,
      onRightIconPress,
      title,
      loading
    } = this.props;

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
