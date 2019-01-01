// Fork of https://github.com/halilb/react-native-textinput-effects
import { Component } from "react";
import PropTypes from "prop-types";

import { Animated, Text, View, ViewPropTypes, Easing } from "react-native";

export default class BaseInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    animationDuration: PropTypes.number,
    useNativeDriver: PropTypes.bool,

    /* those are TextInput props which are overridden
     * so, i'm calling them manually
     */
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);

    this._onLayout = this._onLayout.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this.focus = this.focus.bind(this);

    const value = props.value;
    const error = props.error;

    this.state = {
      value,
      moveLabelAnim: new Animated.Value(value ? 1 : 0),
      selectedAnim: new Animated.Value(0),
      errorAnim: new Animated.Value(error ? 1 : 0),
      shakeAnim: new Animated.Value(0)
    };
  }

  componentWillReceiveProps(newProps) {
    const newValue = newProps.value;
    if (newProps.hasOwnProperty("value") && newValue !== this.state.value) {
      this.setState({
        value: newValue
      });

      // animate input if it's active state has changed with the new value
      // and input is not focused currently.
      const isFocused = this.refs.input.isFocused();
      if (!isFocused) {
        const isActive = Boolean(newValue);
        if (isActive !== this.isActive) {
          this._toggleAnimation(isActive, this.state.moveLabelAnim);
          this._toggleAnimation(isActive, this.state.selectedAnim);
        }
      }
    }

    const newError = newProps.error;
    if (newProps.hasOwnProperty("error") && newError !== this.state.error) {
      this.setState({
        error: newError
      });
      this._toggleAnimation(newError !== "", this.state.errorAnim);
      if (newError != "") {
        this._shake();
      }
    }
  }
  // from https://github.com/react-native-training/react-native-elements/blob/master/src/input/Input.js
  _shake = () => {
    const shakeAnim = this.state.shakeAnim;
    shakeAnim.setValue(0);
    // Animation duration based on Material Design
    // https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
    Animated.timing(shakeAnim, {
      duration: 375,
      toValue: 3,
      ease: Easing.bounce
    }).start();
  };

  _onLayout(event) {
    this.setState({
      width: event.nativeEvent.layout.width
    });
  }

  _onChange(event) {
    this.setState({
      value: event.nativeEvent.text
    });

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(event.nativeEvent.text);
    }
  }

  _onBlur(event) {
    if (!this.state.value) {
      this._toggleAnimation(false, this.state.moveLabelAnim);
    }
    this._toggleAnimation(false, this.state.selectedAnim);

    const onBlur = this.props.onBlur;
    if (onBlur) {
      onBlur(event);
    }
  }

  _onFocus(event) {
    this._toggleAnimation(true, this.state.moveLabelAnim);
    this._toggleAnimation(true, this.state.selectedAnim);

    const onFocus = this.props.onFocus;
    if (onFocus) {
      onFocus(event);
    }
  }

  _toggleAnimation(isActive, animation) {
    const { animationDuration, useNativeDriver } = this.props;
    this.isActive = isActive;
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: animationDuration,
      useNativeDriver
    }).start();
  }

  // public methods

  inputRef() {
    return this.refs.input;
  }

  focus() {
    this.inputRef().focus();
  }

  blur() {
    this.inputRef().blur();
  }

  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
  }
}
