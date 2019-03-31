// @flow

import React from 'react';
import { View } from 'react-native';
import { Colors } from 'mobile/styles/colors';

/**
 * A divider we use for settings and profile edit screens.
 */
const Spacer = () => {
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          paddingTop: 8,
          marginBottom: 4,
          borderTopWidth: 1,
          width: '80%',
          borderColor: Colors.Grey80
        }}
      />
    </View>
  );
};

export default Spacer;
