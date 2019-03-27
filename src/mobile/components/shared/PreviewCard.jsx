// @flow

import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import type { UserProfile } from 'mobile/reducers';
import { getAge } from 'mobile/utils/Birthday';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import { Image } from 'mobile/components/shared/imageCacheFork';

type Props = {
  profile: UserProfile
};

const { width } = Dimensions.get('window');

export default (props: Props) => {
  const { profile } = props;
  return (
    <View
      style={{
        flex: 1,
        margin: 20
      }}
    >
      <View
        style={{
          flex: 2,
          alignItems: 'center'
        }}
      >
        <Image
          key={profile.photoUuids[0]}
          style={{
            width: width - 24,
            height: width - 24,
            borderRadius: 20
          }}
          resizeMode={'contain'}
          uri={GET_PHOTO__ROUTE + profile.photoUuids[0]}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          padding: 20,
          alignItems: 'center',
          marginTop: -30,
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 20,
          shadowOffset: { width: 1, height: 2 },
          shadowColor: 'black',
          shadowOpacity: 0.2
        }}
      >
        <Text style={{ fontSize: 28 }}>
          {`${profile.fields.displayName}, ${getAge(profile.fields.birthday)}`}
        </Text>
      </View>
    </View>
  );
};
