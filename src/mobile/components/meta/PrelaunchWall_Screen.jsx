// @flow

import React from 'react';
import { Text, View, ImageBackground, Image, SafeAreaView } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { type NavigationScreenProp } from 'react-navigation';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { SecondaryButton } from 'mobile/components/shared/buttons';
import { connect } from 'react-redux';
import type { ReduxState } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { Transition } from 'react-navigation-fluid-transitions';
import CountDownTimer from './CountDownTimer';
import NavigationService from '../navigation/NavigationService';

const wavesFull2 = require('../../assets/waves/wavesFullScreen/wavesFullScreen2.png');
const ArthurUri = require('../../assets/arthurIcon.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};
type DispatchProps = {};
type ReduxProps = {
  launchDate: Date,
  isAdmin: boolean
};
type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  const { status: launchDateStatus } = reduxState.launchDate;
  if (!launchDateStatus) {
    throw new Error('No launch date status on Prelaunch Wall Screen');
  }
  return {
    launchDate: new Date(launchDateStatus.launchDate),
    isAdmin: !!reduxState.client && reduxState.client.settings.isAdmin
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

  _onAdminPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate(routes.AdminStack, {});
  };

  render() {
    const { launchDate, isAdmin } = this.props;
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
            {'READY. SET. SMASH.'}
          </Text>
        </Transition>
        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <Transition inline appear="top">
            <View
              style={{
                /* because we're in a transition we need to wrap 
                   animated components in a view that prevents overflow */
                padding: 10,
                margin: -10
              }}
            >
              <CountDownTimer
                date={launchDate}
                onZero={() => {
                  NavigationService.navigate(routes.PrelaunchStartStack);
                }}
              />
            </View>
          </Transition>
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
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-around'
              }}
            >
              <SecondaryButton
                title={'Edit Profile'}
                onPress={this._onProfileEditPress}
              />
              {isAdmin && (
                <SecondaryButton title={'Admin'} onPress={this._onAdminPress} />
              )}
            </View>
          </View>
        </Transition>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrelaunchWallScreen);
