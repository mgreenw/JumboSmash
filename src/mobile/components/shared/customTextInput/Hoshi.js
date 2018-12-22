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
  StyleSheet
} from "react-native";
import BaseInput from "./BaseInput";

const PADDING = 16;
const INSET = 7;
const HEIGHT = 45;

type Props = {
  label: string,
  assitive: string,
  error: string,
  onChange: (value: string) => void,
  containerStyle: any, // TODO: type as a stylesheet
  inputStyle: any,
  labelStyle: any,
  primaryColor: string,
  selectedColor: string,
  errorColor: string
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
      errorColor
    } = this.props;
    const { width, selectedAnim, errorAnim, moveLabelAnim, value } = this.state;
    return (
      <View style={this.props.containerStyle}>
        <View
          style={[
            {
              height: HEIGHT + PADDING,
              width: width
            }
          ]}
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
                    inputRange: [0, 0.5, 0.51, 1],
                    outputRange: [HEIGHT - 15, HEIGHT - 15, 0, 0]
                  }),
                  left: moveLabelAnim.interpolate({
                    inputRange: [0, 0.5, 0.51, 1],
                    outputRange: [INSET, 2 * INSET, 0, INSET]
                  })
                }
              ]}
            >
              <Animated.Text
                style={[
                  inputStyle,
                  {
                    fontSize: moveLabelAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [20, 20, 14]
                    }),
                    // Gah, what an abuse of a variable name.
                    // TODO: make 'undnerlienAnim' be 'selectedAnim'
                    color: selectedAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [primaryColor, primaryColor, selectedColor]
                    })
                  }
                ]}
              >
                {label}
              </Animated.Text>
            </Animated.View>
          </TouchableWithoutFeedback>
          <View style={[styles.labelMask]} />
          // base underline
          <Animated.View
            style={[
              styles.border,
              {
                width:
                  width -
                  selectedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width]
                  }),
                backgroundColor: errorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [primaryColor, errorColor]
                })
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
        </View>
        <View style={{ height: 18, width: "100%" }}>
          <Animated.Text
            style={{
              fontFamily: "SourceSansPro",
              fontSize: 14,
              paddingLeft: 7,
              color: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [primaryColor, errorColor]
              })
            }}
          >
            {this.props.error || this.props.assitive}
          </Animated.Text>
        </View>
      </View>
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
