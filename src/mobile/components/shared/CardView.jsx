// @flow

import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ImageBackground
} from 'react-native';
import type { UserProfile } from 'mobile/reducers/index';
import { getAge } from 'mobile/utils/Birthday';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import { Colors } from 'mobile/styles/colors';
import { Image } from 'mobile/components/shared/imageCacheFork';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import TertiaryButton from 'mobile/components/shared/buttons/TertiaryButton';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type Props = {
  profile: UserProfile,
  onMinimize: () => void,
  onBlockReport: ?() => void
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  profileBlock: {
    marginVertical: 5,
    paddingVertical: 20,
    backgroundColor: Colors.White
  },
  photoBlock: {
    marginVertical: 5,
    backgroundColor: Colors.White
  },
  titleBlock: {
    marginVertical: 5,
    paddingVertical: 35,
    backgroundColor: Colors.White
  }
});

const CardView = (props: Props) => {
  const { profile, onMinimize, onBlockReport } = props;

  const photos = profile.photoUuids.map(photoUuid => (
    <View style={styles.photoBlock} key={photoUuid}>
      <Image
        style={{ width, height: width }}
        uri={GET_PHOTO__ROUTE + photoUuid}
        resizeMode="contain"
      />
    </View>
  ));

  const firstPhoto = photos[0];
  const lastPhoto = photos.length > 1 ? photos[photos.length - 1] : null;
  const middlePhoto1 = photos.length > 2 ? photos[1] : null;
  const middlePhoto2 = photos.length > 3 ? photos[2] : null;

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={wavesFull}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundColor: 'white'
        }}
      />
      <ScrollView
        style={{
          backgroundColor: 'transparent',
          flex: 1
        }}
      >
        {firstPhoto}
        <View style={styles.titleBlock}>
          <View>
            <Text
              style={[
                textStyles.headline4StyleSwiping,
                { textAlign: 'center' }
              ]}
            >
              {`${profile.fields.displayName}, ${getAge(
                profile.fields.birthday
              )}`}
            </Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 20,
                backgroundColor: Colors.White,
                borderRadius: 33
              }}
              onPress={onMinimize}
            >
              <CustomIcon name="down" size={33} color={Colors.SunYellow} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.profileBlock}>
          <View
            style={{
              paddingHorizontal: '10.1%'
            }}
          >
            <Text style={[textStyles.body2Style, { textAlign: 'left' }]}>
              {'About Me'}
            </Text>
            <Text style={[textStyles.body1Style, { textAlign: 'left' }]}>
              {profile.fields.bio}
            </Text>
          </View>
        </View>
        {middlePhoto1}
        {middlePhoto2}
        {lastPhoto}
        {onBlockReport && (
          <View style={styles.profileBlock}>
            <TertiaryButton title={'Block or Report'} onPress={onBlockReport} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CardView;
