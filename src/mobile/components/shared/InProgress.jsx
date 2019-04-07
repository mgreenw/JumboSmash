// @flow

import React from 'react';
import { View, Text } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

type Props = {
  message?: string
};

export default (props: Props) => {
  const { message } = props;

  return (
    <View>
      <Text
        style={[
          textStyles.headline4Style,
          {
            color: Colors.Grapefruit,
            textAlign: 'center',
            paddingBottom: 20
          }
        ]}
      >
        {message}
      </Text>
      <ProgressBar
        progress={0.3}
        height={10}
        unfilledColor={Colors.IceBlue}
        borderWidth={0}
        color={Colors.Grapefruit}
        indeterminate
        borderRadius={6}
        width={null}
      />
    </View>
  );
};
