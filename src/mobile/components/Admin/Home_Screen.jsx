// @flow

import React from 'react';
import { View, ImageBackground, SafeAreaView, Alert } from 'react-native';
import { connect } from 'react-redux';
import GEMHeader from 'mobile/components/shared/Header';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { Colors } from 'mobile/styles/colors';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { CardButton } from 'mobile/components/App/Main/Profile/Profile_Screen';
import routes from 'mobile/components/navigation/routes';
import type { NavigationScreenProp } from 'react-navigation';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type DispatchProps = {};

type ReduxProps = {};

type Props = DispatchProps & ReduxProps & NavigationProps;

function mapStateToProps(state: ReduxState): ReduxProps {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {};
}

type State = {};

class ClassmateOverviewScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _onBack = () => {
    NavigationService.enterApp();
  };

  _onClassmatesListPress = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.AdminClassmateList);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.White }}>
        <GEMHeader
          title={'Admin'}
          leftIcon={{ name: 'back', onPress: this._onBack }}
        />
        <AndroidBackHandler onBackPress={() => true} />
        <ImageBackground
          source={wavesFull}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: -1
          }}
        />
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ flex: 2 }} />
          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'space-evenly',
              backgroundColor: Colors.White,
              shadowColor: '#6F6F6F',
              shadowOpacity: 0.57,
              shadowRadius: 2,
              shadowOffset: {
                height: -1,
                width: 1
              },
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10
            }}
            elevation={5}
          >
            <CardButton
              title={'Classmate List'}
              onPress={this._onClassmatesListPress}
              icon={'menu'}
              loading={false}
            />
            <CardButton
              title={'Stats'}
              onPress={() => {
                Alert.alert('Coming Soon!');
              }}
              icon={'info-circled'}
              loading={false}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassmateOverviewScreen);
