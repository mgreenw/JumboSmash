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
import { Colors } from "mobile/styles/colors";

const PADDING = 16;
const INSET = 7;
const HEIGHT = 45;

export default class Hoshi extends BaseInput {
  static propTypes = {
    /*
     * this is used to set backgroundColor of label mask.
     * this should be replaced if we can find a better way to mask label animation.
     */
    maskColor: PropTypes.string
  };

  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      maskColor
    } = this.props;
    const { width, labelAnim, underlineAnim, value } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const containerWidth = flatStyles.width || width;
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          {
            height: HEIGHT + PADDING,
            width: containerWidth
          }
        ]}
        onLayout={this._onLayout}
      >
        <TextInput
          ref="input"
          {...this.props}
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
                opacity: labelAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0, 1]
                }),
                top: labelAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [HEIGHT - 10, HEIGHT - 10, 0, 0]
                }),
                left: labelAnim.interpolate({
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
                  fontSize: labelAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [20, 20, 14]
                  }),
                  // Gah, what an abuse of a variable name.
                  // TODO: make 'undnerlienAnim' be 'selectedAnim'
                  color: underlineAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [Colors.Black, Colors.Black, Colors.AquaMarine]
                  })
                }
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={[styles.labelMask, { backgroundColor: maskColor }]} />
        // base underline
        <Animated.View
          style={[
            styles.border,
            {
              width:
                width -
                underlineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width]
                }),
              backgroundColor: Colors.Black
            }
          ]}
        />
        // animated underline
        <Animated.View
          style={[
            styles.border,
            {
              width: underlineAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width]
              }),
              backgroundColor: Colors.AquaMarine
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  labelContainer: {
    position: "absolute"
  },
  textInput: {
    position: "absolute",
    bottom: 0,
    left: INSET,
    padding: 0,
    color: "#6a7989",
    fontSize: 18,
    fontWeight: "bold"
  },
  labelMask: {
    height: 24,
    width: INSET
  },
  border: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2
  }
});
