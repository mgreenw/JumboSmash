// @flow

import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Dialog, {
  DialogContent,
  SlideAnimation
} from 'react-native-popup-dialog';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';

export type Option = {
  text: string,
  textStyle?: Object,
  onPress: () => void
};

type Props = {
  visible: boolean,
  options: Option[],
  cancel?: Option,
  cancelOnTouchOutside?: boolean
};

export default (props: Props) => {
  const { visible, cancel, options, cancelOnTouchOutside = true } = props;

  const numOptions = options.length;

  return (
    <Dialog
      dialogAnimation={
        new SlideAnimation({
          slideFrom: 'bottom'
        })
      }
      width={1}
      visible={visible}
      actionsBordered
      dialogStyle={{
        /* This is a hack so that we can do a shadow over a wrapper */
        backgroundColor: 'transparent'
      }}
      onTouchOutside={cancelOnTouchOutside && cancel && cancel.onPress}
      containerStyle={{ justifyContent: 'flex-end' }}
    >
      <DialogContent style={{}}>
        <View style={{ backgroundColor: Colors.White, borderRadius: 4 }}>
          {options.map((o, i) => (
            <View key={o.text}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  paddingVertical: 16,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={o.onPress}
              >
                <Text
                  style={[
                    { textAlign: 'center' },
                    textStyles.body1Style,
                    o.textStyle
                  ]}
                >
                  {o.text}
                </Text>
              </TouchableOpacity>
              {i < numOptions - 1 && (
                <View
                  style={{
                    width: '100%',
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: Colors.BlueyGrey
                  }}
                />
              )}
            </View>
          ))}
        </View>
        {cancel && (
          <View
            style={{
              backgroundColor: Colors.White,
              borderRadius: 4,
              marginTop: 10
            }}
          >
            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 16,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={cancel.onPress}
            >
              <Text
                style={[
                  { textAlign: 'center' },
                  textStyles.body1Style,
                  cancel.textStyle
                ]}
              >
                {cancel.text}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </DialogContent>
    </Dialog>
  );
};
