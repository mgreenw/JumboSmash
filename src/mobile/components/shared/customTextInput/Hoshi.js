// @flow
// Fork of https://github.com/halilb/react-native-textinput-effects
import React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Easing
} from "react-native";
import BaseInput from "./BaseInput";
import AssistiveError from "../AssistiveError";

const PADDING = 16;
const INSET = 7;
const HEIGHT = 45;

type Props = {
  label: string,
  assistive: string,
  error: string,
  onChange: (value: string) => void,
  containerStyle: any, // TODO: type as a stylesheet
  inputStyle: any,
  labelStyle: any,
  primaryColor: string,
  selectedColor: string,
  errorColor: string,
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
};

export default class Hoshi extends BaseInput {
  props: Props;

  render() {
    const {
      label,
      inputStyle,
      labelStyle,
      primaryColor,
      selectedColor,
      errorColor,
      error,
      autoCapitalize
    } = this.props;
    const {
      width,
      selectedAnim,
      errorAnim,
      moveLabelAnim,
      value,
      shakeAnim
    } = this.state;

    // for shake
    const shakeTranslateX = shakeAnim.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
      outputRange: [0, -15, 0, 15, 0, -15, 0]
    });

    // for elements we DON'T want to shake.
    const invertShakeTranslateX = Animated.multiply(-1, shakeTranslateX);
    return (
      <Animated.View
        style={StyleSheet.flatten([
          {
            height: HEIGHT + PADDING,
            width: width
          },
          { transform: [{ translateX: shakeTranslateX }] }
        ])}
        onLayout={this._onLayout}
      >
        <TextInput
          ref="input"
          style={[
            styles.textInput,
            inputStyle,
            {
              width,
              height: HEIGHT
            }
          ]}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={"transparent"}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
        />
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={[
              styles.labelContainer,
              {
                opacity: moveLabelAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0, 1]
                }),
                top: moveLabelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [HEIGHT - 15, 0]
                }),
                left: moveLabelAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [INSET, 2 * INSET, INSET]
                })
              },
              { transform: [{ translateX: invertShakeTranslateX }] }
            ]}
          >
            <Animated.Text
              style={[
                inputStyle,
                {
                  fontSize: moveLabelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 14]
                  }),
                  // Gah, what an abuse of a variable name.
                  // TODO: make 'undnerlienAnim' be 'selectedAnim'
                  color: selectedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      error ? errorColor : primaryColor,
                      error ? errorColor : selectedColor
                    ]
                  })
                }
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={[styles.labelMask]} />
        <View
          style={[
            styles.border,
            {
              width: width,
              backgroundColor: error ? errorColor : primaryColor
            }
          ]}
        />
        // animated underline
        <Animated.View
          style={[
            styles.border,
            {
              width: selectedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width]
              }),
              backgroundColor: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [selectedColor, errorColor]
              })
            }
          ]}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  labelContainer: {
    position: "absolute"
  },
  textInput: {
    position: "absolute",
    bottom: 0,
    left: INSET,
    padding: 0
  },
  labelMask: {
    height: 24,
    width: INSET,
    backgroundColor: "transparent"
  },
  border: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2
  }
});
