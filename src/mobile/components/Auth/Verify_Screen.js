// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { styles } from '../../styles/auth';
import verify from '../../api/auth/verify';
import { login } from '../../actions/auth/login';

type State = {
  code: string,
  validCode: boolean,
  errorMessageCode: string,
  isSubmitting: boolean,
}
type Props = {
  navigation: any,
  utln: string,
  email: string,
  loggedIn: boolean,

  // dispatch function with token
  login: (utln: string, token: string) => void,
};

function mapStateToProps(state, ownProps) {
  console.log(state);
    return {
      loggedIn: state.loggedIn,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
      login: (utln: string, token: string) => { dispatch(login(utln, token)) },
    };
}

class SplashScreen extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        code: '',
        validCode: true,
        errorMessageCode: '',
        isSubmitting: false,
      }
    }

    // IMPORTANT: must be like this in order for back button toggling!
    static navigationOptions = ({navigation}) => ({
        headerLeft: navigation.state.params.headerLeft,
        title: 'Verification',
    });

    componentDidUpdate(prevProps, prevState) {
      if (prevState.isSubmitting != this.state.isSubmitting) {
        this.props.navigation.setParams({
          headerLeft: this.state.isSubmitting ? null : ''});
      }

      if (this.props.loggedIn) {
        const { navigate } = this.props.navigation;
        navigate('App', {});
      }
    }

    _validateUtln = () => {
      if (this.state.code == '') {
        this._codeInputError('Required');
        return false;
      }
      return (true);
    };

    _codeInputError = (errorMessage: string) => {
      this.codeInput.shake();
      this.setState({
        validCode: false,
        errorMessageCode: errorMessage,
      });
    }

    _onSubmit = () => {
      if (!this._validateUtln()) {
        return;
      }
      const { navigation } = this.props;
      const utln = navigation.getParam('utln', '');
      const stopSubmitting = (callBack: () => void) => {
        this.setState({
          isSubmitting: false,
        }, callBack);
      }
      this.setState({
        isSubmitting: true,
        validCode: true,
        errorMessageCode: '',
      }, () => {
          verify(
            { utln: utln,
              code: this.state.code},
            (response, request) => { stopSubmitting(() => {
              this.props.login(utln, response.token);
            }) },
            (response, request) => { stopSubmitting(() => this._codeInputError('Incorrect verification code')) },
            (response, request) => { stopSubmitting(() => this._codeInputError('Expired code')) },
            (response, request) => { stopSubmitting(() => this._codeInputError('No email sent for UTLN: ' + request.utln)) },
            (error, request) => { stopSubmitting(() => this._codeInputError('Could not verify')) },
          );
        });
    }

    codeInput: Input;

    render() {
    const { navigation } = this.props;
    const email = navigation.getParam('email', '')

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
          <View style={{flex: 1}}>
            <Text>
              { "A verification code has been sent to [" + email + "]." }
            </Text>
          </View>
            <View style={{flex: 1, alignSelf: 'stretch', width: '100%',}}>
              <Input
                containerStyle={this.state.validCode
                  ? styles.inputWrapperStyle
                  : styles.inputWrapperStyleWithError}
                placeholderTextColor={'#DDDDDD'}
                inputStyle={{color:'#222222'}}
                labelStyle={styles.labelStyle}
                inputContainerStyle={styles.inputContainerStyle}
                label='Verification Code'
                placeholder=''
                onChangeText={(text) => this.setState({code: text})}
                ref = {input=>this.codeInput = input }
                errorMessage = {this.state.validCode ? '' : this.state.errorMessageCode}
                autoCorrect={false}
              />
              {
                this.state.validCode &&
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpText}>
                    Ex: 123456
                  </Text>
                </View>
              }
            </View>
            <View style={{flex: 1, alignSelf: 'stretch'}}>
              <Button
                buttonStyle={styles.button}
                onPress = {() => {this._onSubmit()}}
                title="submit"
                disabled = {this.state.isSubmitting}
                loading= {this.state.isSubmitting}
              />
            </View>
    </KeyboardAvoidingView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
