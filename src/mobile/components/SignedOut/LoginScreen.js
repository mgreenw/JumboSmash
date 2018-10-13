// @flow

import React, { Component } from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View, KeyboardAvoidingView } from 'react-native';
import { StackNavigator, NavigationScreenProp } from 'react-navigation';
import { Button, Input } from 'react-native-elements';

import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  navigation: any,
  register: (utln: string, password: string) => void,
  loginInProgress: boolean,
};

type State = {
  utln: string,
  password: string,
}

export default class SignupScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
      this.state = {
        utln: '',
        password: '',
      }
    }

    componentDidUpdate(prevProps: Props) {
      if (prevProps.loginInProgress != this.props.loginInProgress) {
        this.props.navigation.setParams({
          headerLeft: this.props.loginInProgress ? null : ''});
      }
    }

    // These are for react navigation, like header bar and such
    static navigationOptions = ({navigation}: any) => ({
        headerLeft: navigation.state.params.headerLeft,
        title: 'Log in',
    });

    _enterApp = () => {
        const { navigate } = this.props.navigation;
        navigate('SignedIn', {})
    }

    _onForgotPasswordClick = () => {
      const { navigate } = this.props.navigation;
      navigate('ForgotPassword', {})
    }

    render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            >
                <Input
                    containerStyle={styles.inputWrapperStyle}
                    placeholderTextColor={'#DDDDDD'}
                    inputStyle={{color:'#222222'}}
                    labelStyle={styles.labelStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    label='Tufts UTLN'
                    placeholder='jjaffe01'
                    onChangeText={(text) => this.setState({utln: text})}
                    autoCorrect={false}
                  />
                  <Input
                    secureTextEntry={true} // For Password
                    containerStyle={styles.inputWrapperStyle}
                    placeholderTextColor={'#DDDDDD'}
                    inputStyle={{color:'#222222'}}
                    labelStyle={styles.labelStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    label='Password'
                    placeholder='foobar'
                    onChangeText={(text) => this.setState({password: text})}
                    autoCorrect={false}
                  />
                  <View style={{width: '100%'}}>
                    <Button
                      containerStyle={{justifyContent: 'center'}}
                      buttonStyle={styles.button}
                      onPress = {this._enterApp}
                      title="Sign In"
                      // disabled = {this.props.registerInProgress}
                      // loading= {this.props.registerInProgress}
                    />
                    <Text style={{
                      textAlign: 'center',
                      textDecorationLine:'underline'}}
                      onPress={this._onForgotPasswordClick}
                      >
                      Forgot Password?
                    </Text>
                  </View>
          </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
  container : {
      flex: 1,
      backgroundColor: '#FFF',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: 30,
      width: '100%',
  },
  title: {
      fontSize: 50,
      letterSpacing: 3,
      textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    marginTop: 10,
    marginBottom: 30,
    height: 40,
    width: '100%',
  },
  inputWrapperStyle: {
    height: 60,
    marginLeft: 5,
    marginRight: 5,
  },
  inputWrapperStyleWithError: {
    height: 80,
    marginLeft: 5,
    marginRight: 5,
  },
  inputContainerStyle: {
    height: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
  },
  labelStyle: {
    height: 20,
  },
  helpTextContainer: {
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 5,
    paddingBottom: 10,
  }
});
