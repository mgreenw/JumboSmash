// @flow

import * as React from 'react';
import {
  Platform,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Header } from 'react-native-elements';
import { textStyles } from 'mobile/styles/textStyles';
import { isIphoneX } from 'mobile/utils/Platform';
import { Constants } from 'expo';

import type { IconName } from 'mobile/assets/icons/CustomIcon';
import HeaderIcon from './HeaderIcon';

/* eslint-disable react/require-default-props */

// centerComponent overrides title
type Props = {
  leftIconName?: IconName,
  rightIconName?: IconName,
  onLeftIconPress?: () => void,
  onRightIconPress?: () => void,
  title: string,
  loading?: boolean,
  borderBottom?: boolean,
  centerComponent?: React.Node,
  onTitlePress?: () => void
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
    loading,
    borderBottom,
    centerComponent,
    onTitlePress
  } = props;

  const LeftIcon = (
    <HeaderIcon
      name={leftIconName}
      disabled={loading}
      onPress={onLeftIconPress}
    />
  );

  const RightIcon = (
    <HeaderIcon
      name={rightIconName}
      disabled={loading}
      onPress={onRightIconPress}
    />
  );

  const Title = (
    <TouchableOpacity disabled={!onTitlePress} onPress={onTitlePress}>
      <Text style={textStyles.headline5Style}>{title}</Text>
    </TouchableOpacity>
  );

  let paddingTop;
  if (isIphoneX()) {
    paddingTop = 20;
  } else if (Platform.OS === 'ios') {
    paddingTop = 0;
  } else {
    paddingTop = Constants.statusBarHeight;
  }

  return (
    <View
      style={{
        paddingTop
      }}
    >
      <Header
        placement="center"
        backgroundColor="transparent"
        leftComponent={LeftIcon}
        leftContainerStyle={{ flex: 0, paddingLeft: 4 }}
        rightComponent={RightIcon}
        rightContainerStyle={{
          flex: 0,
          paddingRight: 4
        }}
        centerComponent={centerComponent || Title}
        containerStyle={{ borderBottomWidth: borderBottom ? 1 : 0 }}
      />
      <StatusBar barStyle="dark-content" />
    </View>
  );
};
