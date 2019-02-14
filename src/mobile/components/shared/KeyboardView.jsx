// @flow

// Use this component for a wrapper around screens that need
// keybaords; it will handle the keyboard avoiding view AND the dismissing

import * as React from 'react'; // need this format to access children
import {
  Image,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { Transition } from 'react-navigation-fluid-transitions';

const waves1 = require('../../assets/waves/waves1/waves.png');

type Props = {
  waves: false | 1,
  children: React.Node,
  verticalOffset?: number,
};

const KeyboardView = (props: Props) => {
  const { waves, children, verticalOffset } = props;
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior="padding"
      keyboardVerticalOffset={verticalOffset}
    >
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>{children}</View>
      </TouchableWithoutFeedback>
      {waves && (
        <Transition inline appear="bottom">
          <Image
            resizeMode="stretch"
            source={waves1}
            style={[Arthur_Styles.waves, { zIndex: -1 }]}
          />
        </Transition>
      )}
    </KeyboardAvoidingView>
  );
};

KeyboardView.defaultProps = {
  verticalOffset: 0,
};

export default KeyboardView;
