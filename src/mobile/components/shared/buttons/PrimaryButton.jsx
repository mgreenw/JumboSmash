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

export class PrimaryButton extends React.Component<Props> {
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
        buttonStyle={Arthur_Styles.buttonPrimaryActive}
        titleStyle={Arthur_Styles.buttonTitlePrimaryActive}
        disabledStyle={Arthur_Styles.buttonPrimaryDisabled}
        disabledTitleStyle={Arthur_Styles.buttonTitlePrimaryDisabled}
        loadingStyle={Arthur_Styles.buttonPrimaryDisabled}
      />
    );
  }
}
