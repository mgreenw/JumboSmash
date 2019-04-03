// @flow

import * as React from 'react';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Dialog, {
  DialogContent,
  ScaleAnimation
} from 'react-native-popup-dialog';
import { Colors } from 'mobile/styles/colors';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Constants } from 'expo';

type Props = {
  visible: boolean,
  onTouchOutside: () => void,
  children: React.Node
};

export default (props: Props) => {
  const { visible, children, onTouchOutside } = props;
  return (
    <Dialog
      dialogAnimation={new ScaleAnimation()}
      width={1}
      visible={visible}
      actionsBordered
      dialogStyle={{
        /* This is a hack so that we can do a shadow over a wrapper */
        backgroundColor: 'transparent',
        padding: 18
      }}
      onTouchOutside={onTouchOutside}
    >
      <DialogContent
        style={{
          backgroundColor: Colors.White,
          borderRadius: 8,
          shadowColor: Colors.Black,
          shadowOpacity: 1,
          shadowRadius: 4,
          shadowOffset: {
            height: 2,
            width: 0
          },
          padding: 20
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>{children}</View>
        </TouchableWithoutFeedback>
        <KeyboardSpacer topSpacing={-Constants.statusBarHeight} />
      </DialogContent>
    </Dialog>
  );
};
