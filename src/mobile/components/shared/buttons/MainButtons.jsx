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

type ButtonStyle = {
  containerDisabled: any,
  containerActive: any,
  titleDisabled: any,
  titleActive: any
};

const CreateStyledButton = (styleProps: ButtonStyle) => (props: Props) => {
  const {
    containerDisabled,
    containerActive,
    titleDisabled,
    titleActive
  } = styleProps;

  const { title, disabled = false, loading = false, onPress } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        /* in case a keyboard is up, buttons close them */
        Keyboard.dismiss();
        onPress();
      }}
      disabled={disabled}
      style={[
        disabled || loading ? containerDisabled : containerActive,
        { justifyContent: 'center', alignItems: 'center', minWidth: '33%' }
      ]}
    >
      <Text
        style={[
          textStyles.subtitle1Style,
          disabled ? titleDisabled : titleActive,
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

const PrimaryButton = CreateStyledButton({
  containerActive: Arthur_Styles.buttonPrimaryActive,
  containerDisabled: Arthur_Styles.buttonPrimaryDisabled,
  titleActive: Arthur_Styles.buttonTitlePrimaryActive,
  titleDisabled: Arthur_Styles.buttonTitlePrimaryDisabled
});

const SecondaryButton = CreateStyledButton({
  containerActive: Arthur_Styles.buttonSecondaryActive,
  titleActive: Arthur_Styles.buttonTitleSecondaryActive,
  containerDisabled: Arthur_Styles.buttonSecondaryDisabled,
  titleDisabled: Arthur_Styles.buttonTitleSecondaryDisabled
});

export { PrimaryButton, SecondaryButton };
