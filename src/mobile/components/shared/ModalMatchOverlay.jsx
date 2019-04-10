// @flow

import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  isVisible: boolean
};

export default (props: Props) => {
  const { isVisible } = props;
  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={'down'}
      onSwipeComplete={() => {}}
      style={{ padding: 0, margin: 0 }}
    >
      <View style={{ height: 100 }} />
    </Modal>
  );
};
