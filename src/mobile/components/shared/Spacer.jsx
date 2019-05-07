// @flow

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from 'mobile/styles/colors';

type Props = {
  style?: StyleSheet.Styles
};
/**
 * A divider we use for settings and profile edit screens.
 */
const Spacer = (props: Props) => {
  const { style } = props;
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          marginTop: 4,
          paddingTop: 8,
          marginBottom: 4,
          borderTopWidth: 1,
          width: '80%',
          borderColor: Colors.Grey80,
          ...style
        }}
      />
    </View>
  );
};

export default Spacer;
