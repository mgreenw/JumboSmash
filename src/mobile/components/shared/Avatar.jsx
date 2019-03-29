// @flow

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import { Colors } from 'mobile/styles/colors';
import { Image } from './imageCacheFork';

const styles = StyleSheet.create({
  border: {
    borderWidth: 4,
    borderColor: Colors.AquaMarine
  }
});

type Props = {
  photoUuid: string,
  size: 'Large' | 'Medium' | 'Small',
  border?: boolean
};

export const LargeWidth = 135;
export const MediumWidth = 75;
export const SmallWidth = 70;

export default (props: Props) => {
  const { photoUuid, size, border } = props;
  let width = 0;
  if (size === 'Large') {
    width = LargeWidth;
  } else if (size === 'Medium') {
    width = MediumWidth;
  } else if (size === 'Small') {
    width = SmallWidth;
  }
  const preview = {
    uri:
      'https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg'
  };
  return (
    <View style={[{ borderRadius: width }, border ? styles.border : {}]}>
      <Image
        uri={GET_PHOTO__ROUTE + photoUuid}
        style={[
          {
            height: width,
            width,
            borderRadius: width / 2,
            overflow: 'hidden'
          }
        ]}
        {...{ preview }}
      />
    </View>
  );
};
