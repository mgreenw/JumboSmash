// @flow

import React from 'react';
import {
  Keyboard,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { textStyles } from 'mobile/styles/textStyles';

type Props = {
  onPress: () => void,
  title: string,
  disabled?: boolean,
  loading?: boolean
};

const PrimaryButton = (props: Props) => {
  const { title, disabled, loading, onPress } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        /* in case a keyboard is up, buttons close them */
        Keyboard.dismiss();
        onPress();
      }}
      disabled={disabled}
      loading={loading}
      style={[
        disabled || loading
          ? Arthur_Styles.buttonPrimaryDisabled
          : Arthur_Styles.buttonPrimaryActive,
        { justifyContent: 'center', alignItems: 'center', minWidth: '33%' }
      ]}
    >
      <Text
        style={[
          textStyles.subtitle1Style,
          disabled
            ? Arthur_Styles.buttonTitlePrimaryDisabled
            : Arthur_Styles.buttonTitlePrimaryActive,
          loading ? { color: 'transparent' } : {}
        ]}
      >
        {title}
      </Text>
      <ActivityIndicator
        style={{ position: 'absolute', alignSelf: 'center' }}
        animating={loading}
      />
    </TouchableOpacity>
  );
};

export { PrimaryButton };
