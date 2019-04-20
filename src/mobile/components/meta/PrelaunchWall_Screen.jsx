// @flow

import React from 'react';
import { Text, View, ImageBackground, Image, SafeAreaView } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { type NavigationScreenProp } from 'react-navigation';
import GEMHeader from 'mobile/components/shared/Header';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { SecondaryButton } from 'mobile/components/shared/buttons';
import { connect } from 'react-redux';
import type { ReduxState } from 'mobile/reducers/index';

const wavesFull2 = require('../../assets/waves/wavesFullScreen/WavesFullScreen2.png');
const ArthurUri = require('../../assets/arthurIcon.png');

const CountDownTimer = () => {
  return (
    <View style={{ height: 40, width: 50, backgroundColor: 'red' }}>
      <Text>{'2 D : 3 H : 45 M'}</Text>
    </View>
  );
};

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};
type DispatchProps = {};
type ReduxProps = {
  launchDate: Date
};
type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  const { launchDate } = reduxState;
  if (!launchDate) {
    throw new Error('No launch date on Prelaunch Wall Screen');
  }
  return {
    launchDate
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

  render() {
    const { launchDate } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={wavesFull2}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
        <GEMHeader title="" />
        <AndroidBackHandler onBackPress={() => true} />
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={[textStyles.headline4StyleDemibold, { textAlign: 'center' }]}
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
            <View style={{ height: 40, width: 50, backgroundColor: 'red' }}>
              <Text>{'2 D : 3 H : 45 M'}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: 'blue' }}>
              <Image
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: '100%'
                }}
                source={ArthurUri}
              />
            </View>
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
            <SecondaryButton title={'Edit Profile'} onPress={() => {}} />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrelaunchWallScreen);
