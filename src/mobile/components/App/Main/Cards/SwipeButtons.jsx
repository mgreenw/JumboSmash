// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { Colors } from 'mobile/styles/colors';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { SwipeDirection } from './Deck';

type Props = {
  disabled: boolean,
  onPress: (swipeDirection: SwipeDirection) => void
};

export default (props: Props) => {
  const { onPress, disabled } = props;
  return (
    <View>
      <TouchableOpacity
        onPress={() => onPress('left')}
        style={Arthur_Styles.swipeButton_dislike}
      >
        <CustomIcon
          name="delete-filled"
          size={65}
          color={disabled ? 'gray' : 'black'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress('right')}
        style={Arthur_Styles.swipeButton_like}
      >
        <CustomIcon
          name="heart-filled"
          size={65}
          color={disabled ? 'gray' : Colors.Grapefruit}
        />
      </TouchableOpacity>
    </View>
  );
};
