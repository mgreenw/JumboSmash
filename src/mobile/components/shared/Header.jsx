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
import { connect } from 'react-redux';
import type { ReduxState } from 'mobile/reducers/index';

import type { IconName } from 'mobile/assets/icons/CustomIcon';
import HeaderIcon from './HeaderIcon';

type IconProps = {
  name: IconName,
  onPress: () => void
};

// centerComponent overrides title
type ProppyProps = {
  leftIcon: ?IconProps,
  rightIcon: ?IconProps,
  title: string,
  loading?: boolean,
  borderBottom?: boolean,
  centerComponent?: React.Node,
  onTitlePress?: () => void
};

type ReduxProps = {
  hasUnreadMessages: boolean
};

type Props = ProppyProps & ReduxProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  const { numBadges } = reduxState;
  return {
    hasUnreadMessages: numBadges !== null && numBadges > 0
  };
}

const GemHeader = (props: Props) => {
  // TODO: make this styling via a style sheet, and better!
  const {
    leftIcon,
    rightIcon,
    title,
    loading,
    borderBottom,
    centerComponent,
    onTitlePress,
    hasUnreadMessages
  } = props;

  const LeftIcon = (
    <HeaderIcon
      name={leftIcon ? leftIcon.name : null}
      disabled={loading}
      onPress={leftIcon ? leftIcon.onPress : () => {}}
    />
  );

  const RightIcon = (
    <HeaderIcon
      name={rightIcon ? rightIcon.name : null}
      disabled={loading}
      onPress={rightIcon ? rightIcon.onPress : () => {}}
      badge={hasUnreadMessages}
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

  const content = (
    <View
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {LeftIcon}
      {centerComponent || Title}
      {RightIcon}
    </View>
  );

  return (
    <View
      style={{
        paddingTop
      }}
    >
      <Header
        placement="center"
        backgroundColor="transparent"
        leftComponent={null}
        leftContainerStyle={{ flex: 0 }}
        rightComponent={null}
        rightContainerStyle={{ flex: 0 }}
        centerComponent={content}
        containerStyle={{
          borderBottomWidth: borderBottom ? 1 : 0,
          paddingHorizontal: 0
        }}
      />
      <StatusBar barStyle="dark-content" />
    </View>
  );
};

export default connect(mapStateToProps)(GemHeader);
