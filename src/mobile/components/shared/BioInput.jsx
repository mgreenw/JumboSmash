// @flow
/* eslint-disable */

import React from 'react';
import { Animated, Text, TextInput, View } from 'react-native';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import BaseInput from 'mobile/components/shared/customTextInput/BaseInput';

type Props = {
  value: string,
  onChangeText: (bio: string) => void,
  label?: string
};

const MAX_LENGTH = 500;

export default class BioInput extends BaseInput {
  props: Props;

  render() {
    const { value, onChangeText, label } = this.props;
    const charactersLeft = MAX_LENGTH - value.length;

    // from base input
    const { selectedAnim } = this.state;

    return (
      <View style={{ height: '100%' }}>
        {label && (
          <Animated.Text
            style={[
              textStyles.body2Style,
              {
                paddingLeft: 7,
                paddingBottom: 5,
                color: selectedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Colors.Black, Colors.AquaMarine]
                })
              }
            ]}
          >
            {label}
          </Animated.Text>
        )}
        <Animated.View
          style={{
            borderWidth: 1.5,
            borderRadius: 3,
            borderColor: selectedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [Colors.Black, Colors.AquaMarine]
            })
          }}
        >
          <TextInput
            ref="input"
            style={[
              textStyles.headline6Style,
              {
                height: '100%',
                padding: 9,
                textAlignVertical: 'top'
              }
            ]}
            onBlur={this._onBlur}
            onChange={this._onChange}
            onFocus={this._onFocus}
            placeholderTextColor={Colors.Grey80}
            placeholder="Let everyone know how quirky you are"
            onChangeText={(text) => {
              const noIndents = text.replace(/(\n)( *)(\n)/, '\n');
              return onChangeText(noIndents);
            }}
            autoCorrect
            multiline
            value={value}
            maxLength={MAX_LENGTH}
            underlineColorAndroid={'transparent'}
          />
        </Animated.View>
        <View>
          <Text
            style={[
              textStyles.body2Style,
              { paddingRight: 6, textAlign: 'right' },
              charactersLeft <= 15
                ? { color: Colors.Grapefruit }
                : { color: Colors.Black }
            ]}
          >
            {charactersLeft}
          </Text>
        </View>
      </View>
    );
  }
}
