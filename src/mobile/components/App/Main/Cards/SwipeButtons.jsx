// @flow

import React from 'react';
import { View, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo';
import { Colors } from 'mobile/styles/colors';
import CustomIcon from 'mobile/assets/icons/CustomIcon';

const { width } = Dimensions.get('window');

const iconHeight = 65;

type Props = {
  disabled: boolean,
  onPressDislike: () => void,
  onPressLike: () => void,
  swipeThreshold: number,
  swipeAnimation: Animated.Value
};

export const SWIPE_BUTTON_HEIGHT = 100;

export default (props: Props) => {
  const {
    onPressLike,
    onPressDislike,
    disabled,
    swipeAnimation,
    swipeThreshold
  } = props;

  const inputRange = [
    -swipeThreshold - 1,
    -swipeThreshold,
    0,
    swipeThreshold,
    swipeThreshold + 1
  ];
  const outPutRangeLeft = [1.1, 1.1, 1, 0.95, 0.95];
  const outPutRangeRight = outPutRangeLeft.slice().reverse();
  const scaleLeft = swipeAnimation.interpolate({
    inputRange,
    outputRange: outPutRangeLeft
  });
  const scaleRight = swipeAnimation.interpolate({
    inputRange,
    outputRange: outPutRangeRight
  });

  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)', 'white']}
      locations={[0.1, 0.4, 0.7]}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SWIPE_BUTTON_HEIGHT
      }}
    >
      <View
        style={{
          marginBottom: 30,
          marginHorizontal: width / 4,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Animated.View style={{ transform: [{ scale: scaleLeft }] }}>
          <TouchableOpacity
            onPress={disabled ? () => {} : onPressDislike}
            style={{
              height: iconHeight,
              width: iconHeight,
              borderRadius: iconHeight / 2,
              backgroundColor: 'white'
            }}
          >
            <CustomIcon
              name="delete-filled"
              size={iconHeight}
              color={disabled ? 'gray' : 'black'}
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: scaleRight }] }}>
          <TouchableOpacity
            onPress={disabled ? () => {} : onPressLike}
            style={{
              height: iconHeight,
              width: iconHeight,
              borderRadius: iconHeight / 2,
              backgroundColor: 'white'
            }}
          >
            <CustomIcon
              name="heart-filled"
              size={iconHeight}
              color={disabled ? 'gray' : Colors.Grapefruit}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};
