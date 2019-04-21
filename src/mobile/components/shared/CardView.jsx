// @flow

import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Image as ReactNativeImage
} from 'react-native';
import type { UserProfile } from 'mobile/reducers/index';
import { getAge } from 'mobile/utils/Birthday';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import { Colors } from 'mobile/styles/colors';
import { Image } from 'mobile/components/shared/imageCacheFork';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import TertiaryButton from 'mobile/components/shared/buttons/TertiaryButton';
import { codeToLocation } from 'mobile/data/Locations';
import { CityIconsMap } from 'mobile/assets/icons/locations/';
import { codeToName as dormCodeToName } from 'mobile/data/Dorms/';

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
    paddingHorizontal: '10.1%',
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

  const {
    postgradRegion: postgradLocationCode,
    freshmanDorm: freshmanDormCode,
    springFlingActArtist
  } = profile.fields;

  const postgradLocation = postgradLocationCode
    ? codeToLocation(postgradLocationCode)
    : null;
  const postgradLocationName = postgradLocation ? postgradLocation.name : null;
  const postgradLocationImage = postgradLocation
    ? postgradLocation.image || 'Marker'
    : 'Marker';

  const postGradLocationBlock = postgradLocation ? (
    <View style={styles.profileBlock}>
      <View
        style={{
          paddingHorizontal: '10.1%',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View>
          <Text
            style={[
              textStyles.body2StyleBold,
              { textAlign: 'left', paddingBottom: 5 }
            ]}
          >
            {'Post Grad'}
          </Text>

          <Text style={[textStyles.headline6Style, { textAlign: 'left' }]}>
            {postgradLocationName}
          </Text>
        </View>
        <ReactNativeImage
          style={{ width: 60, height: 60, bottom: 6 }}
          source={CityIconsMap[postgradLocationImage]}
        />
      </View>
    </View>
  ) : null;

  const [{ url: artistUrl = null }] = springFlingActArtist
    ? springFlingActArtist.images.slice(-1)
    : [{}];
  const artistBlock = springFlingActArtist ? (
    <View style={styles.profileBlock}>
      <View
        style={{
          paddingHorizontal: '10.1%',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View>
          <Text
            style={[
              textStyles.body2StyleBold,
              { textAlign: 'left', paddingBottom: 5 }
            ]}
          >
            {'Spring Fling Artist'}
          </Text>

          <Text style={[textStyles.headline6Style, { textAlign: 'left' }]}>
            {springFlingActArtist.name}
          </Text>
        </View>

        {artistUrl && (
          <Image
            style={{ width: 60, height: 60, borderRadius: 30 }}
            uri={artistUrl}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  ) : null;

  const freshmanDormName = freshmanDormCode
    ? dormCodeToName(freshmanDormCode)
    : null;
  const freshmanDormBlock = freshmanDormName ? (
    <View style={styles.profileBlock}>
      <View
        style={{
          paddingHorizontal: '10.1%',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View>
          <Text
            style={[
              textStyles.body2StyleBold,
              { textAlign: 'left', paddingBottom: 5 }
            ]}
          >
            {'1st Year Dorm'}
          </Text>

          <Text style={[textStyles.headline6Style, { textAlign: 'left' }]}>
            {freshmanDormName}
          </Text>
        </View>
      </View>
    </View>
  ) : null;

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
                { textAlign: 'center', paddingVertical: 35 }
              ]}
            >
              {`${profile.fields.displayName}, ${getAge(
                profile.fields.birthday
              )}`}
            </Text>
            <View
              style={{
                height: '100%',
                position: 'absolute',
                right: 0,
                width: 50
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={onMinimize}
              >
                <CustomIcon name="down" size={40} color={Colors.SunYellow} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.profileBlock}>
          <View
            style={{
              paddingHorizontal: '10.1%'
            }}
          >
            <Text
              style={[
                textStyles.body2StyleBold,
                { textAlign: 'left', paddingBottom: 5 }
              ]}
            >
              {'About Me'}
            </Text>
            <Text style={[textStyles.headline6Style, { textAlign: 'left' }]}>
              {profile.fields.bio}
            </Text>
          </View>
        </View>
        {postGradLocationBlock}
        {freshmanDormBlock}
        {artistBlock}
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
