// @flow

import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo';
import { Colors } from 'mobile/styles/colors';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { SwipeDirection } from './Deck';

const { width } = Dimensions.get('window');

type Props = {
  disabled: boolean,
  onPress: (swipeDirection: SwipeDirection) => void
};

export default (props: Props) => {
  const { onPress, disabled } = props;
  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)', 'white']}
      locations={[0.1, 0.4, 0.7]}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100
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
        <TouchableOpacity
          onPress={() => onPress('left')}
          style={{
            height: 65,
            width: 65,
            borderRadius: 65 / 2,
            backgroundColor: 'white'
          }}
        >
          <CustomIcon
            name="delete-filled"
            size={65}
            color={disabled ? 'gray' : 'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress('right')}
          style={{
            height: 65,
            width: 65,
            borderRadius: 65 / 2,
            backgroundColor: 'white'
          }}
        >
          <CustomIcon
            name="heart-filled"
            size={65}
            color={disabled ? 'gray' : Colors.Grapefruit}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
