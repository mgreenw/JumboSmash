// @flow
import React from "react";
import { StyleSheet, Animated, View, Keyboard, Text } from "react-native";
import { textStyles } from "mobile/styles/textStyles";
import { Colors } from "mobile/styles/colors";

type SingleDigitInputProps = {
  value: string,
  selected: boolean
};

type SingleDigitInputState = {
  selectedAnim: Animated.Value
};

const WIDTH = 28;
const HEIGHT = 33;

const NORMAL_LINE_THICKNESS = 2;
const SELECTED_LINE_THICKNESS = 8;

export class SingleDigitInput extends React.Component<
  SingleDigitInputProps,
  SingleDigitInputState
> {
  constructor(props: SingleDigitInputProps) {
    super(props);
    const { selected } = this.props;
    this.state = {
      selectedAnim: new Animated.Value(selected ? 1 : 0)
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
  }

  render() {
    const { selectedAnim } = this.state;
    const scaleX = selectedAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2]
    });
    const scaleY = selectedAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2]
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
            backgroundColor: Colors.AquaMarine,
            height: NORMAL_LINE_THICKNESS
          }}
        />
      </Animated.View>
    );
  }
}

// Gah... why isn't this a dynamic size? Because storing the refs if it's
// dynamic is super sketchy, and since this is an internal module, let's
// prioritize stable code over extensabiliity in this case.
const NUM_CHARS = 6;

type CodeInputProps = {
  value: string
};
type CodeInputState = {};

export class CodeInput extends React.Component<CodeInputProps, CodeInputState> {
  constructor(props: CodeInputProps) {
    super(props);
    const { value } = this.props;
    this.state = {
      index: value.length
    };
  }

  // _renderSingleInputs(input: string) {
  //   const inputLen = input.length;
  //   const characterArray: Array<string> = Array(numChars).fill("");
  //   for (let i = 0; i < inputLen; i++) {
  //     const j = i;
  //     characterArray[i] = input.charAt(j);
  //   }
  //   return characterArray.map<SingleDigitInput>(char => {
  //     return (
  //       <View>
  //         <Text>{data.time}</Text>
  //       </View>
  //     );
  //   });
  // }

  render() {
    const input = this.props.value;
    const inputLen = input.length;
    console.log(input, inputLen);
    const characterArray: Array<string> = Array(NUM_CHARS).fill("");
    for (let i = 0; i < inputLen; i++) {
      const j = i;
      characterArray[i] = input.charAt(j);
    }
    return (
      <View
        style={{
          width: "100%",
          height: HEIGHT
        }}
      >
        <View
          style={{
            justifyContent: "space-evenly",
            flexDirection: "row",
            flex: 1,
            width: "100%"
          }}
        >
          <View style={{ flex: 1 }}>
            <SingleDigitInput
              value={characterArray[0]}
              selected={inputLen === 0}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SingleDigitInput
              value={characterArray[1]}
              selected={inputLen === 1}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SingleDigitInput
              value={characterArray[2]}
              selected={inputLen === 2}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SingleDigitInput
              value={characterArray[3]}
              selected={inputLen === 3}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SingleDigitInput
              value={characterArray[4]}
              selected={inputLen === 4}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SingleDigitInput
              value={characterArray[5]}
              selected={inputLen === 5}
            />
          </View>
        </View>
      </View>
    );
  }
}
