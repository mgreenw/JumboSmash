// @flow

import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { type NavigationScreenProp } from 'react-navigation';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { SecondaryButton } from 'mobile/components/shared/buttons';
import { connect } from 'react-redux';
import type {
  ReduxState,
  UserProfile,
  Dispatch,
  ProfileFields
} from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { ExtendedProfileInputs } from 'mobile/components/App/Main/Profile/ProfileEdit_Screen';
import { codeToLocation as postgradCodeToLocation } from 'mobile/data/Locations';
import { codeToName as dormCodeToName } from 'mobile/data/Dorms/';
import Collapsible from 'react-native-collapsible';
import saveProfileFieldsAction from 'mobile/actions/app/saveProfile';
import CountDownTimer from './CountDownTimer';

const wavesFull2 = require('../../assets/waves/wavesFullScreen/wavesFullScreen2.png');
const ArthurUri = require('../../assets/arthurIcon.png');

const style = StyleSheet.create({
  card: {
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
});

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};
type DispatchProps = {
  saveProfileFields: (fields: ProfileFields) => void
};

type ReduxProps = {
  launchDate: Date,
  profile: UserProfile,
  saveProfileInProgress: boolean
};
type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {
  showDone: boolean,
  showExtendedOptions: boolean
};

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

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    saveProfileFields: (fields: ProfileFields) => {
      dispatch(saveProfileFieldsAction(fields));
    }
  };
}

class PrelaunchWallScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { profile } = props;
    const {
      postgradRegion: postgradLocationCode,
      freshmanDorm: freshmanDormCode,
      springFlingAct,
      springFlingActArtist
    } = profile.fields;
    const hasAllExtendedProfileFields =
      !!postgradLocationCode &&
      !!freshmanDormCode &&
      !!springFlingAct &&
      !!springFlingActArtist;

    this.state = {
      showExtendedOptions: !hasAllExtendedProfileFields,
      showDone: hasAllExtendedProfileFields
    };
  }

  componentDidUpdate(oldProps: Props) {
    const { saveProfileInProgress: oldInProgress } = oldProps;
    const { profile, saveProfileInProgress: newInProgress } = this.props;
    const { showExtendedOptions, showDone } = this.state;
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

    if (!newInProgress && oldInProgress !== newInProgress) {
      if (showExtendedOptions && !showDone && hasAllExtendedProfileFields) {
        this.setState({
          showDone: false, // will show at end of first animation
          showExtendedOptions: false
        });
      }
    }
  }

  _onProfileEditPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate(routes.ProfileEdit, {});
  };

  _saveDorm = (freshmanDorm: string) => {
    const { saveProfileFields, profile } = this.props;
    saveProfileFields({
      ...profile.fields,
      freshmanDorm
    });
  };

  _saveLocation = (postgradRegion: string) => {
    const { saveProfileFields, profile } = this.props;
    saveProfileFields({
      ...profile.fields,
      postgradRegion
    });
  };

  _saveArtist = (
    springFlingAct: null | string,
    /* eslint-disable-next-line no-unused-vars */
    springFlingActArtist
  ) => {
    const { saveProfileFields, profile } = this.props;
    saveProfileFields({
      ...profile.fields,
      springFlingAct
    });
  };

  render() {
    const { width } = Dimensions.get('window');
    const { launchDate, profile, saveProfileInProgress } = this.props;
    const { showDone, showExtendedOptions } = this.state;
    const {
      postgradRegion: postgradLocationCode,
      freshmanDorm: freshmanDormCode,
      springFlingActArtist
    } = profile.fields;

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
          {showDone ? 'READY. SET. SMASH.' : "YOU'RE ALL SET"}
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
          <Collapsible collapsed={!showDone} duration={1200}>
            <Image
              resizeMode="contain"
              style={{
                height: 200,
                width: 200,
                marginVertical: '11%'
              }}
              source={ArthurUri}
            />
          </Collapsible>
        </View>

        <Collapsible style={{ width }} collapsed={!showDone} duration={1500}>
          <View style={style.card}>
            <View style={{ width: '100%' }}>
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
          </View>
        </Collapsible>

        <Collapsible
          collapsed={!showExtendedOptions}
          duration={1500}
          onAnimationEnd={() => {
            this.setState({
              showDone: true, // will show at end of first animation
              showExtendedOptions: false
            });
          }}
        >
          <View style={style.card}>
            <View style={{ width: '100%' }}>
              <Text
                style={[textStyles.headline5Style, { textAlign: 'center' }]}
              >
                {'Spice up your profile'}
              </Text>
              <Text
                style={[
                  textStyles.body1Style,
                  { textAlign: 'center', paddingBottom: '11.5%' }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {'Help your fellow Jumbos get to know you.'}
              </Text>
              <View style={{ paddingHorizontal: '10%' }}>
                <ExtendedProfileInputs
                  artist={{
                    value: artistName,
                    onSave: (id, artist) => {
                      this._saveArtist(id, artist);
                    }
                  }}
                  dorm={{
                    value: freshmanDormName,
                    onSave: newCode => {
                      this._saveDorm(newCode);
                    }
                  }}
                  location={{
                    value: postgradLocationName,
                    onSave: newLocation => {
                      this._saveLocation(newLocation);
                    }
                  }}
                  loading={saveProfileInProgress}
                />
              </View>
            </View>
          </View>
        </Collapsible>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrelaunchWallScreen);
