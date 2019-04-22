// @flow

import React from 'react';
import { Text, View, ImageBackground, Image, SafeAreaView } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { type NavigationScreenProp } from 'react-navigation';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { SecondaryButton } from 'mobile/components/shared/buttons';
import { connect } from 'react-redux';
import type { ReduxState, UserProfile } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { ExtendedProfileInputs } from 'mobile/components/App/Main/Profile/ProfileEdit_Screen';
import { codeToLocation as postgradCodeToLocation } from 'mobile/data/Locations';
import { codeToName as dormCodeToName } from 'mobile/data/Dorms/';
import CountDownTimer from './CountDownTimer';

const wavesFull2 = require('../../assets/waves/wavesFullScreen/wavesFullScreen2.png');
const ArthurUri = require('../../assets/arthurIcon.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};
type DispatchProps = {};
type ReduxProps = {
  launchDate: Date,
  profile: UserProfile,
  saveProfileInProgress: boolean
};
type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  const { launchDate } = reduxState;
  if (!launchDate) {
    throw new Error('No launch date on Prelaunch Wall Screen');
  }
  if (!reduxState.client) {
    throw new Error('client is null in launch wall Screen');
  }
  return {
    launchDate,
    profile: reduxState.client.profile,
    saveProfileInProgress: reduxState.inProgress.saveProfile
  };
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

class PrelaunchWallScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _onProfileEditPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate(routes.ProfileEdit, {});
  };

  _renderEditProfile = () => {
    return (
      <View>
        <Text
          style={[
            textStyles.headline5Style,
            { textAlign: 'center', paddingBottom: 15 }
          ]}
        >
          {"You're all set."}
        </Text>
        <Text
          style={[
            textStyles.body1Style,
            { textAlign: 'center', paddingBottom: 35 }
          ]}
        >
          {
            'Your profile is ready. In the meantime, don’t forget to tell your friends.'
          }
        </Text>
        <SecondaryButton
          title={'Edit Profile'}
          onPress={this._onProfileEditPress}
        />
      </View>
    );
  };

  render() {
    const { launchDate, profile, saveProfileInProgress } = this.props;
    const {
      postgradRegion: postgradLocationCode,
      freshmanDorm: freshmanDormCode,
      springFlingAct,
      springFlingActArtist
    } = profile.fields;
    const hasAllExtendedProfileFields =
      postgradLocationCode &&
      freshmanDormCode &&
      springFlingAct &&
      springFlingActArtist;

    const freshmanDormName = freshmanDormCode
      ? dormCodeToName(freshmanDormCode)
      : null;
    const postgradLocation = postgradLocationCode
      ? postgradCodeToLocation(postgradLocationCode)
      : null;
    const postgradLocationName = postgradLocation
      ? postgradLocation.name
      : null;
    const artistName = springFlingActArtist ? springFlingActArtist.name : null;

    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <AndroidBackHandler onBackPress={() => true} />
        <ImageBackground
          source={wavesFull2}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
        <Text
          style={[
            textStyles.headline4StyleDemibold,
            { textAlign: 'center', paddingVertical: '5.5%' }
          ]}
        >
          {'READY. SET. SMASH.'}
        </Text>
        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <CountDownTimer date={launchDate} />
          <Image
            resizeMode="contain"
            style={{
              flex: 1,
              marginVertical: '11%'
            }}
            source={ArthurUri}
          />
        </View>

        <View
          style={{
            backgroundColor: Colors.White,
            width: '100%',
            paddingHorizontal: 30,
            alignItems: 'center',
            paddingTop: 25,
            paddingBottom: 35,
            shadowColor: '#6F6F6F',
            shadowOpacity: 0.57,
            shadowRadius: 2,
            shadowOffset: {
              height: 2,
              width: 1
            },
            borderRadius: 10
          }}
        >
          {hasAllExtendedProfileFields ? (
            this._renderEditProfile()
          ) : (
            <ExtendedProfileInputs
              artist={{
                value: artistName,
                onSave: () => {}
              }}
              dorm={{
                value: freshmanDormName,
                onSave: () => {}
              }}
              location={{
                value: postgradLocationName,
                onSave: () => {}
              }}
              loading={saveProfileInProgress}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrelaunchWallScreen);
