// @flow

import React from 'react';
import { View, Keyboard, Text } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';

type Props = {
  onPress: () => void,
  title: string,
};

export default (props: Props) => {
  const { onPress, title } = props;
  return (
    <View style={{ height: 18 }}>
      <Text
        onPress={() => {
          /* in case a keyboard is up, buttons close them */
          Keyboard.dismiss();
          onPress();
        }}
        value={title}
        containerStyle={{ width: '100%' }}
        style={[textStyles.body2Style, { textAlign: 'center', textDecorationLine: 'underline' }]}
      >
        {title}
      </Text>
    </View>
  );
};
