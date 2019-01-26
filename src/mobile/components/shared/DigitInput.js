// @flow
import * as React from "react";
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
import DevTesting from "mobile/utils/DevTesting";

type SingleDigitInputProps = {
  value: string,
  emphasized: boolean, // for enlarging
  primaryColor: string,
  errorColor: string,
  error: boolean,
  selectedColor: string,
  placeholder: string,
  secondaryColor: string,
  selectedAnim: Animated.Value
};

type SingleDigitInputState = {
  emphasizedAnim: Animated.Value,
  errorAnim: Animated.Value
};

function _toggleAnimation(
  animation: Animated.Value,
  active: boolean,
  duration?: number
) {
  Animated.timing(animation, {
    toValue: active ? 1 : 0,
    useNativeDriver: false,
    duration
  }).start();
}

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
    const { emphasized, error } = this.props;
    this.state = {
      emphasizedAnim: new Animated.Value(emphasized ? 1 : 0),
      errorAnim: new Animated.Value(error ? 1 : 0)
    };
  }

  static defaultProps = {
    placeholder: ""
  };

  componentDidUpdate(
    prevProps: SingleDigitInputProps,
    prevState: SingleDigitInputState
  ) {
    if (this.props.emphasized != prevProps.emphasized) {
      _toggleAnimation(this.state.emphasizedAnim, this.props.emphasized, 200);
    }
    if (!prevProps.error && this.props.error) {
      _toggleAnimation(this.state.errorAnim, true);
    } else if (!this.props.error && prevProps.error) {
      _toggleAnimation(this.state.errorAnim, false);
    }
  }

  render() {
    const { errorAnim, emphasizedAnim } = this.state;
    const {
      primaryColor,
      errorColor,
      selectedColor,
      secondaryColor,
      value,
      placeholder,
      selectedAnim,
      error
    } = this.props;
    const scaleX = emphasizedAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2]
    });
    const scaleY = emphasizedAnim.interpolate({
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
          style={[
            textStyles.headline5Style,
            {
              textAlign: "center",
              color: value ? primaryColor : secondaryColor
            }
          ]}
        >
          {value || placeholder}
        </Text>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: error ? errorColor : primaryColor,
            height: NORMAL_LINE_THICKNESS
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: selectedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"]
            }),
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
type MultiDigitInputProps = {
  value: string,
  onChangeValue: string => void,
  maxLength: number,
  error: string,
  assistive: string,
  placeholder: string,
  label?: string,
  secondaryColor: string,
  primaryColor: string,
  errorColor: string,
  selectedColor: string
};
type MultiDigitInputState = {
  shakeAnim: Animated.Value,
  selectedAnim: Animated.Value,
  isFocused: boolean
};

function MultiDigitInput(
  alterSingleDigits: (
    React.ChildrenArray<React.Element<typeof SingleDigitInput>>
  ) => React.Node
) {
  return class extends React.Component<
    MultiDigitInputProps,
    MultiDigitInputState
  > {
    constructor(props: MultiDigitInputProps) {
      super(props);
      this.state = {
        shakeAnim: new Animated.Value(0),
        selectedAnim: new Animated.Value(0),
        isFocused: false
      };
    }

    static defaultProps = {
      maxLength: 6,
      placeholder: "",
      secondaryColor: Colors.BlueyGrey,
      primaryColor: Colors.Black,
      errorColor: Colors.Grapefruit,
      selectedColor: Colors.AquaMarine
    };

    componentDidUpdate(
      prevProps: MultiDigitInputProps,
      prevState: MultiDigitInputState
    ) {
      if (!prevProps.error && this.props.error) {
        this._shake();
      }
      if (this.state.isFocused != prevState.isFocused) {
        _toggleAnimation(this.state.selectedAnim, this.state.isFocused);
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
      const { shakeAnim, isFocused, selectedAnim } = this.state;
      const {
        assistive,
        error,
        maxLength,
        placeholder,
        label,
        errorColor,
        primaryColor,
        selectedColor,
        secondaryColor
      } = this.props;
      const input = this.props.value;
      const inputLen = input.length;
      const characterArray: Array<string> = Array(maxLength).fill("");
      for (let i = 0; i < inputLen; i++) {
        const j = i;
        characterArray[i] = input.charAt(j);
      }
      const digitList = characterArray.map((char, index) => {
        return (
          <SingleDigitInput
            secondaryColor={secondaryColor}
            primaryColor={primaryColor}
            errorColor={errorColor}
            selectedColor={selectedColor}
            value={characterArray[index]}
            selected={isFocused}
            emphasized={inputLen === index && isFocused}
            key={index}
            error={error != null && error != ""}
            placeholder={placeholder.length > index ? placeholder[index] : ""}
            selectedAnim={this.state.selectedAnim}
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
            {label && (
              <Animated.Text
                style={[
                  textStyles.body2styles,
                  {
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
            )}
            <Animated.View
              style={{
                height: HEIGHT,
                transform: [{ translateX: shakeTranslateX }]
              }}
            >
              <TextInput
                style={[StyleSheet.absoluteFill, { color: "transparent" }]}
                value={input}
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
                  justifyContent: "space-between",
                  flexDirection: "row",
                  flex: 1,
                  width: "100%"
                }}
              >
                {alterSingleDigits(digitList)}
              </View>
            </Animated.View>
            <View style={{ paddingTop: 10 }}>
              <AssistiveError {...this.props} centered={true} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  };
}

function makeDividor(key) {
  return (
    <Text
      key={key}
      style={{
        color: Colors.BlueyGrey,
        fontSize: 30,
        fontFamily: "SourceSansPro",
        fontWeight: "300"
      }}
    >
      {"/"}
    </Text>
  );
}

function birthdayDividors(singleDigts) {
  const singleDigtsWithDividors = React.Children.toArray(singleDigts);
  const length = singleDigtsWithDividors.length;

  // This should never happen, but let's have a nice error message anyways.
  if (length != 6) {
    DevTesting.log("ERROR: birthdayDividors called on array of size, ", length);
  } else {
    singleDigtsWithDividors.splice(2, 0, makeDividor("dividor 1"));
    singleDigtsWithDividors.splice(5, 0, makeDividor("dividor 2"));
  }

  return singleDigtsWithDividors;
}

export const CodeInput = MultiDigitInput(digits => digits);

export const BirthdayInput = MultiDigitInput(birthdayDividors);
