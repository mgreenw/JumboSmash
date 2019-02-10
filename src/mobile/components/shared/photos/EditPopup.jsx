// @flow

import * as React from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet,
} from 'react-native';
import Dialog, { DialogContent, SlideAnimation } from 'react-native-popup-dialog';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';

type Props = {
  visible: boolean,
  onReorder: () => void,
  onDelete: () => void,
  onCancel: () => void,
};

// TODO: make this dynamic and accept a bunch of different kinds of buttons.
// for now, let's see if this is any good as a fairly hard coded thing.

export default (props: Props) => {
  const {
    visible, onReorder, onDelete, onCancel,
  } = props;

  return (
    <Dialog
      dialogAnimation={
        new SlideAnimation({
          slideFrom: 'bottom',
        })
      }
      width={1}
      visible={visible}
      actionsBordered
      dialogStyle={{
        /* This is a hack so that we can do a shadow over a wrapper */
        backgroundColor: 'transparent',
      }}
      onTouchOutside={onCancel}
      containerStyle={{ justifyContent: 'flex-end' }}
    >
      <DialogContent style={{}}>
        <View style={{ backgroundColor: Colors.White, borderRadius: 4 }}>
          <TouchableOpacity
            style={{
              width: '100%',
              paddingVertical: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onReorder}
          >
            <Text style={[{ textAlign: 'center' }, textStyles.body1Style]}>Reorder Photo</Text>
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.BlueyGrey,
            }}
          />
          <TouchableOpacity
            style={{
              width: '100%',
              paddingVertical: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onDelete}
          >
            <Text
              style={[textStyles.body1Style, { textAlign: 'center', color: Colors.Grapefruit }]}
            >
              Delete Photo
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: Colors.White, borderRadius: 4, marginTop: 10 }}>
          <TouchableOpacity
            style={{
              width: '100%',
              paddingVertical: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onCancel}
          >
            <Text style={[{ textAlign: 'center' }, textStyles.body1Style]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </DialogContent>
    </Dialog>
  );
};
