// @flow
/* eslint-disable */

import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Header } from 'react-native-elements';
import { textStyles } from 'mobile/styles/textStyles';

import { routes } from 'mobile/components/Navigation';

import type { IconName } from 'mobile/assets/icons/CustomIcon';
import { HeaderIcon } from './HeaderIcon';

type screen =
  | 'profile'
  | 'cards'
  | 'matches'
  | 'onboarding-start'
  | 'onboarding-main'
  | 'profile-edit';

type Props = {
  leftIconName?: IconName,
  rightIconName?: IconName,
  onLeftIconPress?: () => void,
  onRightIconPress?: () => void,
  title: string,
  loading?: boolean,
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
      loading,
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
          centerComponent={
            <View>
              <Text style={textStyles.headline5Style}>{title}</Text>
            </View>
          }
          outerContainerStyles={{ borderBottomWidth: 0 }}
        />
        <StatusBar barStyle="dark-content" />
      </View>
    );
  }
}
