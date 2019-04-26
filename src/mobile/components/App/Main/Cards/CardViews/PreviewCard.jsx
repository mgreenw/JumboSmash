// @flow

import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import type { UserProfile, ProfileFields } from 'mobile/reducers';
import { getAge } from 'mobile/utils/Birthday';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import { Image } from 'mobile/components/shared/imageCacheFork';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { codeToName as dormcodeToName } from 'mobile/data/Dorms/';
import { codeToLocation as postgradCodeToLocation } from 'mobile/data/Locations';

type Props = {
  clientProfileFields: ?ProfileFields,
  profile: UserProfile
};

function inCommonExtendedFields(
  fields1: ProfileFields,
  fields2: ProfileFields
) {
  const {
    springFlingAct: artist1,
    postgradRegion: region1,
    freshmanDorm: dorm1,
    springFlingActArtist
  } = fields1;
  const {
    springFlingAct: artist2,
    postgradRegion: region2,
    freshmanDorm: dorm2
  } = fields2;

  if (!!artist1 && artist1 === artist2) {
    if (springFlingActArtist) {
      return {
        hasMatchingExtendedField: true,
        text: (
          <Text>
            {'Also dreams of '}
            <Text style={textStyles.body2StyleBold}>
              {springFlingActArtist.name}
            </Text>
          </Text>
        )
      };
    }
  }

  if (!!region1 && region1 === region2) {
    const postgradLocation = postgradCodeToLocation(region1);
    if (postgradLocation) {
      const { name, code } = postgradLocation;
      if (
        // these are Idk, On the Road, Somewhere, Everywhere.
        code !== 'xx.xx.01' &&
        code !== 'xx.yy.01' &&
        code !== 'xx.xx' &&
        code !== 'xx.yy'
      )
        // If Boston, have special copy
        return {
          hasMatchingExtendedField: true,
          text: (
            <Text>
              {code === 'na.us.ma.7' ? 'Also staying in' : 'Also moving to '}
              <Text style={textStyles.body2StyleBold}>{name}</Text>
            </Text>
          )
        };
    }
  }

  if (!!dorm1 && dorm1 === dorm2) {
    // Exceptions: don't show for off campus:
    const dormName = dormcodeToName(dorm1);
    if (dorm1 !== 'OffCampus' && !!dormName) {
      // If it has a number, it's an address, so say "at" vs "in"
      return {
        hasMatchingExtendedField: true,
        text: (
          <Text>
            {/\d/.test(dormName) ? 'Also lived at' : 'Also lived in '}
            <Text style={textStyles.body2StyleBold}>{dormName}</Text>
          </Text>
        )
      };
    }
  }
  return {
    hasMatchingExtendedField: false,
    text: ''
  };
}

export default (props: Props) => {
  const { profile, clientProfileFields } = props;
  const { width, height } = Dimensions.get('window');
  const minHeight = width;
  const useHeight = Math.max(height * 0.6, minHeight);

  const {
    hasMatchingExtendedField = false,
    text: matchingFieldsText = ''
  } = clientProfileFields
    ? inCommonExtendedFields(clientProfileFields, profile.fields)
    : {};

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
            backgroundColor: 'white',
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.2,
            elevation: 1
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
          alignItems: 'center',
          marginTop: -30,
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 10,
          shadowOffset: { width: 1, height: 2 },
          shadowColor: 'black',
          shadowOpacity: 0.2,
          elevation: 1
        }}
      >
        {hasMatchingExtendedField && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              backgroundColor: Colors.SunYellow,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              height: 10
            }}
          />
        )}
        <Text style={[textStyles.headline4StyleSwiping, { paddingTop: 20 }]}>
          {`${profile.fields.displayName}, ${getAge(profile.fields.birthday)}`}
        </Text>
        <Text style={[textStyles.body2Style, { paddingBottom: 10 }]}>
          {matchingFieldsText}
        </Text>
      </View>
    </View>
  );
};
