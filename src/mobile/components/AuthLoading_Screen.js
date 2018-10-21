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
// import { validateToken } from '../../api/auth/validateToken';

type Props = {
  navigation: any,
};

type State = {
}

function mapStateToProps(state: State, ownProps: Props) {
  console.log('AuthLoading Redux State:', state);
    return {};
}

function mapDispatchToProps(dispatch, ownProps: Props) {
    return {
      // validateToken: (token: string) => { dispatch(validateToken(token)) }
    };
}

class AuthLoadingScreen extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {}

      // TODO: remove debugging timeout / make a nice loading screen animation
      setTimeout(
        this._bootstrapAsync,
        1000
      );
    }

    // TODO: instead of hardcoding these values, let's give them nice keys somehow
    _bootstrapAsync = async () => {
      const utln = await AsyncStorage.getItem('utln');
      const token = await AsyncStorage.getItem('token');
      console.log(utln, token);
      const { navigate } = this.props.navigation;

      // If we have retrieved both utln and token from the phone's store,
      // then we check that the token is still valid -- if so, we navigate to
      // the app. Otherwise, we navigate to the auth flow.
      if (utln && token) {
        // validateToken(utln, token);
      }

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
