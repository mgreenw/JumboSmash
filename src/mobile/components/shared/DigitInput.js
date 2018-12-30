// @flow
import React from "react";
import {
  StyleSheet,
  Animated,
  View,
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Easing
} from "react-native";
import { textStyles } from "mobile/styles/textStyles";
import { Colors } from "mobile/styles/colors";
import AssistiveError from "mobile/components/shared/AssistiveError";

type SingleDigitInputProps = {
  value: string,
  selected: boolean,
  primaryColor: string,
  errorColor: string,
  error: boolean,
  selectedColor: string
};

type SingleDigitInputState = {
  selectedAnim: Animated.Value,
  errorAnim: Animated.Value
};

const WIDTH = 35;
const HEIGHT = 33;

const NORMAL_LINE_THICKNESS = 2;
const SELECTED_LINE_THICKNESS = 8;

class SingleDigitInput extends React.Component<
  SingleDigitInputProps,
  SingleDigitInputState
> {
  constructor(props: SingleDigitInputProps) {
    super(props);
    const { selected } = this.props;
    this.state = {
      selectedAnim: new Animated.Value(selected ? 1 : 0),
      errorAnim: new Animated.Value(0)
    };
  }

  componentDidUpdate(
    prevProps: SingleDigitInputProps,
    prevState: SingleDigitInputState
  ) {
    if (this.props.selected != prevProps.selected) {
      Animated.timing(this.state.selectedAnim, {
        toValue: this.props.selected ? 1 : 0,
        duration: 200,
        useNativeDriver: false
      }).start();
    }
    if (!prevProps.error && this.props.error) {
      this._toggleErrorAnim(true);
    } else if (!this.props.error && prevProps.error) {
      this._toggleErrorAnim(false);
    }
  }

  _toggleErrorAnim = (active: boolean) => {
    Animated.timing(this.state.errorAnim, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  render() {
    const { selectedAnim, errorAnim } = this.state;
    const { primaryColor, errorColor, selectedColor } = this.props;
    const scaleX = selectedAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2]
    });
    const scaleY = selectedAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3]
    });
    return (
      <Animated.View
        style={{
          height: HEIGHT,
          width: WIDTH,
          transform: [
            {
              scaleX: scaleX
            },
            {
              scaleY: scaleY
            }
          ]
        }}
      >
        <Text
          containerStyle={{ width: "100%" }}
          style={[textStyles.headline5Style, { textAlign: "center" }]}
        >
          {this.props.value}
        </Text>
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: errorAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [selectedColor, errorColor]
            }),
            height: NORMAL_LINE_THICKNESS
          }}
        />
      </Animated.View>
    );
  }
}

// if length is exceeded, bad things will happen.
type CodeInputProps = {
  value: string,
  onChangeValue: string => void,
  maxLength: number,
  error: string,
  assistive: string
};
type CodeInputState = {
  shakeAnim: Animated.Value,
  isFocused: boolean
};

export class CodeInput extends React.Component<CodeInputProps, CodeInputState> {
  constructor(props: CodeInputProps) {
    super(props);
    const { value } = this.props;
    this.state = {
      shakeAnim: new Animated.Value(0),
      isFocused: false
    };
  }

  componentDidUpdate(prevProps: CodeInputProps, prevState: CodeInputState) {
    if (!prevProps.error && this.props.error) {
      this._shake();
    }
  }

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

  inputRef: TextInput;

  _handleInputFocus = () => this.setState({ isFocused: true });

  _handleInputBlur = () => this.setState({ isFocused: false });

  // for shaking input if all empty but delete is pressed
  // TODO: get type for NativeEvent
  _onKeyPress = (event: any) => {
    const isBackspace = event.nativeEvent.key === "Backspace";
    const deleteOnEmpty = isBackspace && this.props.value === "";
    const keyOnMaxLength =
      !isBackspace && this.props.value.length === this.props.maxLength;
    if (deleteOnEmpty || keyOnMaxLength) {
      this._shake();
    }
  };

  render() {
    const { shakeAnim, isFocused } = this.state;
    const input = this.props.value;
    const { assistive, error, maxLength } = this.props;
    const inputLen = input.length;
    const characterArray: Array<string> = Array(maxLength).fill("");
    for (let i = 0; i < inputLen; i++) {
      const j = i;
      characterArray[i] = input.charAt(j);
    }
    const digitList = characterArray.map((char, index) => {
      return (
        <SingleDigitInput
          value={characterArray[index]}
          selected={inputLen === index && isFocused}
          key={index}
          primaryColor={Colors.Black}
          errorColor={Colors.Grapefruit}
          selectedColor={Colors.AquaMarine}
          error={error != null && error != ""}
        />
      );
    });

    const shakeTranslateX = shakeAnim.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
      outputRange: [0, -15, 0, 15, 0, -15, 0]
    });

    return (
      <TouchableWithoutFeedback
        style={{
          width: "100%"
        }}
        onPress={() => {
          this.inputRef.focus();
        }}
      >
        <View>
          <Animated.View
            style={{
              height: HEIGHT,
              transform: [{ translateX: shakeTranslateX }]
            }}
          >
            <TextInput
              style={[StyleSheet.absoluteFill, { color: "transparent" }]}
              keyboardType="numeric"
              placeholder=""
              onChangeText={this.props.onChangeValue}
              autoCorrect={false}
              spellCheck={false}
              ref={ref => (this.inputRef = ref)}
              underlineColorAndroid={"transparent"}
              onFocus={this._handleInputFocus}
              onBlur={this._handleInputBlur}
              maxLength={this.props.maxLength}
              onKeyPress={this._onKeyPress}
              caretHidden={true}
            />
            <View
              style={{
                justifyContent: "space-evenly",
                flexDirection: "row",
                flex: 1,
                width: "100%"
              }}
            >
              {digitList}
            </View>
          </Animated.View>
          <View style={{ paddingTop: 10 }}>
            <AssistiveError
              {...this.props}
              centered={true}
              primaryColor={Colors.Black}
              errorColor={Colors.Grapefruit}
              selectedColor={Colors.AquaMarine}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
