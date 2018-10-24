// @flow

import React from 'react';
import {
  Alert,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  Text,
  View, } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import checkTokenValid from '../api/auth/checkTokenValid';

type Props = {
  navigation: any,
};

type State = {
}

function mapStateToProps(state: State, ownProps: Props) {
    return {};
}

function mapDispatchToProps(dispatch, ownProps: Props) {
    return {};
}

// This component is the screen we see on initial app startup, as we are
// loading the state of the app / determining if the user is already logged in.
// If the user is logged in, we then navigate to App, otherwise to Auth.
class AuthLoadingScreen extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {}

      // TODO: remove debugging timeout / make a nice loading screen animation
      setTimeout(
        this._bootstrapAsync,
        2000,
      );
    }

    // TODO: instead of hardcoding these values, let's give them nice keys somehow
    _bootstrapAsync = async () => {
      const utln = await AsyncStorage.getItem('utln');
      const token = await AsyncStorage.getItem('token');

      // If we have retrieved both utln and token from the phone's store,
      // then we check that the token is still valid -- if so, we navigate to
      // the app. Otherwise, we navigate to the auth flow.
      if (utln && token) {
        checkTokenValid(
          { utln: utln,
            token: token},
          (response, request) => {this._onValidToken()},
          (response, request) => {this._onInvalidToken()},
           // Treat any errors as an invalid token, make them log in
          (response, request) => {this._onInvalidToken()});
      } else {
        this._onInvalidToken();
      }
    }

    _onValidToken = () => {
      const { navigate } = this.props.navigation;
      navigate('App');
    }

    _onInvalidToken = () => {
      const { navigate } = this.props.navigation;
      navigate('Auth');
    }

    render() {
      return (
        <View style={{
          flex: 1,
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center'}}>
          <Text>
            PROJECT GEM
          </Text>
          <ActivityIndicator/>
          <StatusBar barStyle="default"/>
        </View>
      );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
