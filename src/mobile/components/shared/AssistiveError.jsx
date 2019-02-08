// @flow
/* eslint-disable */

// Displays an assistive message, or transitions to an console.error

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Text, View, Easing, StyleSheet } from 'react-native';
import { Colors } from 'mobile/styles/colors';

type Props = {
  assistive: string,
  error: string,
  primaryColor: string,
  errorColor: string,
  centered?: boolean,
};

type State = {
  errorAnim: Animated.Value,
};

export default class AssistiveError extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorAnim: new Animated.Value(0),
    };
  }

  static defaultProps = {
    primaryColor: Colors.Black,
    errorColor: Colors.Grapefruit,
    selectedColor: Colors.AquaMarine,
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
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
      useNativeDriver: false,
    }).start();
  };

  render() {
    const { error, assistive, primaryColor, errorColor, centered } = this.props;
    const { errorAnim } = this.state;

    return (
      <View
        style={[
          {
            height: 18,
            width: '100%',
          },
          centered && {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.text,
            {
              textAlign: centered ? 'center' : null,
              color: errorColor,
              opacity: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          {error}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.text,
            {
              textAlign: 'center',
              color: primaryColor,
              opacity: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          {error ? '' : assistive /* to instantly fade */}
        </Animated.Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SourceSansPro',
    fontSize: 14,
    paddingLeft: 7,
    position: 'absolute',
  },
});
