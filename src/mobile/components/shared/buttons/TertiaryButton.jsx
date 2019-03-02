// @flow

import React from 'react';
import { View, Keyboard, Text } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

type Props = {
  onPress: () => void,
  title: string,
  hidden?: boolean // we commmonly hide tertiary buttons
};

export default (props: Props) => {
  const { onPress, title, hidden } = props;
  return (
    <View style={{ height: 18 }}>
      <Text
        onPress={
          hidden
            ? () => {} /* don't perform action if hidden */
            : () => {
                /* in case a keyboard is up, buttons close them */
                Keyboard.dismiss();
                onPress();
              }
        }
        value={title}
        containerStyle={{ width: '100%' }}
        style={[
          textStyles.body2Style,
          {
            textAlign: 'center',
            textDecorationLine: 'underline',
            color: hidden ? 'transparent' : Colors.Black
          }
        ]}
      >
        {title}
      </Text>
    </View>
  );
};
