// @flow

import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { type NavigationScreenProp } from 'react-navigation';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import {
  SecondaryButton,
  PrimaryButton
} from 'mobile/components/shared/buttons';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { Transition } from 'react-navigation-fluid-transitions';
import type { LaunchDateStatus } from 'mobile/api/serverTypes';
import checkLaunchDateAction from 'mobile/actions/meta/checkLaunchDate';
import { WebBrowser } from 'expo';
import Sentry from 'sentry-expo';
import * as Animatable from 'react-native-animatable';
import NavigationService from '../navigation/NavigationService';

const wavesFull2 = require('../../assets/waves/wavesFullScreen/wavesFullScreen2.png');
const ArthurUri = require('../../assets/arthurIcon.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};
type DispatchProps = {
  checkLaunchDate: () => void
};
type ReduxProps = {
  launchDateStatus: LaunchDateStatus,
  checkLaunchDateInProgress: boolean,
  checkLaunchDateSuccess: null | boolean
};
type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  const {
    status: launchDateStatus,
    inProgress,
    response
  } = reduxState.launchDate;
  if (!launchDateStatus) {
    throw new Error('No launch date status on Prelaunch Wall Screen');
  }
  return {
    launchDateStatus,
    checkLaunchDateInProgress: inProgress.checkLaunchDate,
    checkLaunchDateSuccess: response.checkLaunchDateSuccess
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    checkLaunchDate: () => {
      dispatch(checkLaunchDateAction());
    }
  };
}

class PrelaunchStartScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps: Props) {
    const {
      checkLaunchDateInProgress: nowChecking,
      checkLaunchDateSuccess,
      launchDateStatus
    } = this.props;
    const { checkLaunchDateInProgress: wasChecking } = prevProps;
    if (!nowChecking && wasChecking && checkLaunchDateSuccess === true) {
      if (new Date(launchDateStatus.launchDate) > new Date()) {
        // This means they somehow got to this page (probably by editting the time),
        // but should not have, and then attempted to fix it. If we want to handle that case explicitly,
        // put logic here. It's non trivial to reset the countdown screen because of the unmounts, so
        // I'm ommitting an explicit handle for that -- they can stay on this screen.
      }
      if (launchDateStatus.wallIsUp) {
        // This means they somehow got to this page (probably by editting the time),
        // but should not have, and are attempting to enter the app.
        Sentry.captureMessage('Time Hacker Detected.');
        Alert.alert(
          'ERROR',
          'Time Hack Detected',
          [
            {
              text: 'Hack Time',
              onPress: () => {
                WebBrowser.openBrowserAsync(
                  'https://www.youtube.com/watch?v=fQGbXmkSArs?autoplay=1'
                );
              },
              style: 'cancel'
            }
          ],
          { cancelable: false }
        );
      } else {
        // Good to go! Actually time to enter app.
        NavigationService.enterApp();
      }
    }
  }

  _onStartPress = () => {
    const { checkLaunchDate } = this.props;
    checkLaunchDate();
  };

  _onProfileEditPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate(routes.ProfileEdit, {});
  };

  render() {
    const { checkLaunchDateInProgress } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <AndroidBackHandler onBackPress={() => true} />
        <ImageBackground
          source={wavesFull2}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
        <Transition inline appear="top">
          <Text
            style={[
              textStyles.headline4StyleDemibold,
              { textAlign: 'center', paddingVertical: '5.5%' }
            ]}
          >
            {'SWIPE. SWIPE. SMASH.'}
          </Text>
        </Transition>
        <Transition inline appear="top">
          <View
            style={{
              /* fake benig a countdown timer */
              backgroundColor: Colors.White,
              paddingHorizontal: 26,
              paddingVertical: 10,
              borderRadius: 4
            }}
          >
            <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
              {"It's time."}
            </Text>
          </View>
        </Transition>

        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              flex: 1,
              marginVertical: '11%'
            }}
            source={ArthurUri}
          />
        </View>

        <Transition inline appear="bottom">
          <View
            style={{
              backgroundColor: Colors.White,
              width: '100%',
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
            <Text
              style={[
                textStyles.headline5Style,
                { textAlign: 'center', paddingBottom: 15 }
              ]}
            >
              {'Ready to Swipe?'}
            </Text>
            <Animatable.View
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={{ paddingBottom: 15 }}
            >
              <PrimaryButton
                title={'Dive In'}
                onPress={this._onStartPress}
                loading={checkLaunchDateInProgress}
              />
            </Animatable.View>
            <SecondaryButton
              title={'Edit Profile'}
              onPress={this._onProfileEditPress}
              loading={checkLaunchDateInProgress}
            />
          </View>
        </Transition>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrelaunchStartScreen);
