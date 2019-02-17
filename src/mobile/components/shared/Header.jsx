// @flow

import React from 'react';
import { Platform, View, Text, StatusBar } from 'react-native';
import { Header } from 'react-native-elements';
import { textStyles } from 'mobile/styles/textStyles';
import { Constants } from 'expo';

import type { IconName } from 'mobile/assets/icons/CustomIcon';
import HeaderIcon from './HeaderIcon';

/* eslint-disable react/require-default-props */
type Props = {
  leftIconName?: IconName,
  rightIconName?: IconName,
  onLeftIconPress?: () => void,
  onRightIconPress?: () => void,
  title: string,
  loading?: boolean
};
/* eslint-enable */

export default (props: Props) => {
  // TODO: make this styling via a style sheet, and better!
  const {
    leftIconName,
    rightIconName,
    onLeftIconPress,
    onRightIconPress,
    title,
    loading
  } = props;

  return (
    <View
      style={{
        paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight
      }}
    >
      <Header
        placement="center"
        backgroundColor="transparent"
        leftComponent={(
<HeaderIcon
            name={leftIconName}
            disabled={loading}
            onPress={onLeftIconPress}
          />
)}
        rightComponent={(
<HeaderIcon
            name={rightIconName}
            disabled={loading}
            onPress={onRightIconPress}
          />
)}
        centerComponent={(
<View>
            <Text style={textStyles.headline5Style}>{title}</Text>
          </View>
)}
        outerContainerStyles={{ borderBottomWidth: 0 }}
      />
      <StatusBar barStyle="dark-content" />
    </View>
  );
};
