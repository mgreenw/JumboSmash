// @flow
/* eslint-disable */

import React from 'react';
import { View, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';

type Props = {
  onPress: () => void,
  title: string,
  disabled?: boolean,
  loading?: boolean,
};

export class SecondaryButton extends React.Component<Props> {
  render() {
    return (
      <Button
        onPress={() => {
          Keyboard.dismiss(); // in case a keyboard is up, buttons close them
          this.props.onPress();
        }}
        title={this.props.title}
        disabled={this.props.disabled}
        loading={this.props.loading}
        containerStyle={{ width: '100%' }}
        buttonStyle={Arthur_Styles.buttonSecondaryActive}
        titleStyle={Arthur_Styles.buttonTitleSecondaryActive}
        disabledStyle={Arthur_Styles.buttonSecondaryDisabled}
        disabledTitleStyle={Arthur_Styles.buttonTitleSecondaryDisabled}
        loadingStyle={Arthur_Styles.buttonSecondaryDisabled}
      />
    );
  }
}
