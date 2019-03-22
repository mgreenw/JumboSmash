// @flow

import React from 'react';
import { View } from 'react-native';
import { Colors } from 'mobile/styles/colors';

const LENGTH = 10;
const PADDING = 3;
// For now, this is pretty specific for the Messages icon badge.
// TODO: make more modular for the messages screen list icons
export default () => {
  return (
    <View
      style={{
        height: LENGTH + PADDING,
        width: LENGTH + PADDING,
        borderRadius: LENGTH + PADDING,
        backgroundColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center',
        left: -LENGTH / 2
      }}
    >
      <View
        style={{
          height: LENGTH,
          width: LENGTH,
          borderRadius: LENGTH,
          backgroundColor: Colors.Grapefruit
        }}
      />
    </View>
  );
};
