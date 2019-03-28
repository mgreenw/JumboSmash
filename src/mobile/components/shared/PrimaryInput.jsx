// @flow
/* eslint-disable */

import React from 'react';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { View } from 'react-native';
import AssistiveError from 'mobile/components/shared/AssistiveError';
import Hoshi from './customTextInput/Hoshi';

type Props = {
  label: string,
  assistive: string,
  error: string,
  containerStyle: any, // TODO: type as a stylesheet
  onChange: (value: string) => void,
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
  value?: string,
  maxLength?: number
};

type State = {};

export class PrimaryInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const errorColor = Colors.Grapefruit;
    const primaryColor = Colors.Black;
    return (
      <View style={this.props.containerStyle}>
        <Hoshi
          {...this.props}
          labelStyle={textStyles.body2Style}
          inputStyle={textStyles.headline6Style}
          primaryColor={primaryColor}
          selectedColor={Colors.AquaMarine}
          errorColor={errorColor}
        />
        <AssistiveError
          {...this.props}
          primaryColor={primaryColor}
          errorColor={errorColor}
        />
      </View>
    );
  }
}
