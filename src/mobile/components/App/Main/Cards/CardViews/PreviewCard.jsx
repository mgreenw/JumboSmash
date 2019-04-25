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

export default (props: Props) => {
  const { width, height } = Dimensions.get('window');
  const minHeight = width;
  const useHeight = Math.max(height * 0.6, minHeight);

  const { profile } = props;
  return (
    <View
      style={{
        margin: 20,
        flex: 1,
        justifyContent: 'center',
        marginBottom: 100
      }}
    >
      <View
        style={{
          alignItems: 'center'
        }}
      >
        <View
          style={{
            /* In case image is not properly cropped, fallback to this */
            width: width - 24,
            height: useHeight,
            borderRadius: 20,
            backgroundColor: 'white'
          }}
        >
          <Image
            key={profile.photoUuids[0]}
            style={{
              width: width - 24,
              height: useHeight,
              borderRadius: 20
            }}
            resizeMode={'cover' /* don't stretch people */}
            uri={GET_PHOTO__ROUTE + profile.photoUuids[0]}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          alignItems: 'center',
          marginTop: -30,
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 20,
          shadowOffset: { width: 1, height: 2 },
          shadowColor: 'black',
          shadowOpacity: 0.2,
          elevation: 1
        }}
      >
        <Text style={{ fontSize: 28 }}>
          {`${profile.fields.displayName}, ${getAge(profile.fields.birthday)}`}
        </Text>
      </View>
    </View>
  );
};
