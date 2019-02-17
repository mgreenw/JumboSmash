// @flow

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import { Image } from './imageCacheFork';

type Props = {
  photoId: number,
  size: 'Large' | 'Medium' | 'Small',
  onPress: () => void
};

const LargeWidth = 135;
const MediumWidth = 75;
const SmallWidth = 70;

export default (props: Props) => {
  const { photoId, size, onPress } = props;
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
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: 'transparent',
          borderRadius: width / 2,
          width
        }
      ]}
    >
      <Image
        uri={GET_PHOTO__ROUTE + photoId}
        style={{
          height: width,
          width,
          borderRadius: width / 2,
          overflow: 'hidden'
        }}
        {...{ preview }}
      />
    </TouchableOpacity>
  );
};
