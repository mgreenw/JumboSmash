// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';


import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  navigation: any,
  register: (utln: string, password: string) => void,
  registerInProgress: boolean,
};

type State = {
  utln: string,
  password: string,
  passwordConfirm: string,
  valid: {
    utln: boolean,
    password: boolean,
    passwordConfirm: boolean,
  },
  errorMessage: {
    utln: string,
    password: string,
    passwordConfirm: string,
  }
}

class SignupScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
      this.state = {
        utln: '',
        password: '',
        passwordConfirm: '',

        // all valid so that we don't shake the first time.
        valid: {
          utln: true,
          password: true,
          passwordConfirm: true,
        },
        errorMessage: {
          utln: '',
          password: '',
          passwordConfirm: '',
        }
      }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.registerInProgress != this.props.registerInProgress) {
        this.props.navigation.setParams({
          headerLeft: this.props.registerInProgress ? null : ''});
      }
    }

    // for refs
    utlnInput: Input;
    passwordInput: Input;
    passwordConfirmInput: Input;

    // These are for react navigation, like header bar and such
    static navigationOptions = ({navigation}) => ({
        headerLeft: navigation.state.params.headerLeft,
        title: 'Sign Up',
    });

    _onSignUp = () => {
        const { navigate } = this.props.navigation;
        let valid = this._validateFields();

        if (valid) {
          this.props.register(this.state.utln, this.state.password);
        }
        // navigate('Splash', {})
    };

    _validateFields = () => {
      let _valid = {
          utln: true,
          password: true,
          passwordConfirm: true,
        }

      let _errorMessage = {
        utln: '',
        password: '',
        passwordConfirm: '',
      }

        // TODO: parse valid utln here also?
        if (this.state.utln == '') {
          this.utlnInput.shake();
          _valid.utln = false;
          _errorMessage.utln = 'Required'
        }

        // for no password
        if (this.state.password == '') {
          this.passwordInput.shake();
          _valid.password = false;
          _errorMessage.password = 'Required'
        }

        // for non matching confirmation
        if ((this.state.passwordConfirm == '')
          || (this.state.password != this.state.passwordConfirm)) {
          this.passwordConfirmInput.shake();
          this.passwordInput.shake();
          _valid.passwordConfirm = false;
          _errorMessage.passwordConfirm = this.state.passwordConfirm == '' ? 'Required' : 'Passwords Must Match!'
        }

        this.setState({valid: _valid, errorMessage: _errorMessage});
        return (_valid.utln && _valid.password && _valid.passwordConfirm);
    };

    render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
                <View
                  style={styles.formContainer}
                  behavior="padding">
                    <Input
                      containerStyle={styles.inputWrapperStyle}
                      placeholderTextColor={'#DDDDDD'}
                      inputStyle={{color:'#222222'}}
                      labelStyle={styles.labelStyle}
                      inputContainerStyle={styles.inputContainerStyle}
                      label='Tufts UTLN'
                      placeholder='jjaffe01'
                      onChangeText={(text) => this.setState({utln: text})}
                      ref = {input=>this.utlnInput = input }
                      errorMessage = {this.state.valid.utln ? '' : this.state.errorMessage.utln}
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
                      ref = {input=>this.passwordInput = input }
                      errorMessage = {this.state.valid.password ? '' : this.state.errorMessage.password}
                      errorStyle = {{height: 20}}
                      autoCorrect={false}
                    />
                </View>
                <Button
                  containerStyle={{justifyContent: 'center'}}
                  buttonStyle={styles.button}
                  onPress = {() => {this._onSignUp()}}
                  title="Sign Up"
                  disabled = {this.props.registerInProgress}
                  loading= {this.props.registerInProgress}
                />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
  container : {
      flex: 1,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
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
    height: 80,
    marginLeft:5
  },
  inputContainerStyle: {
    height: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
  },
  labelStyle: {
    height: 20,
  }
});

function mapStateToProps(state, ownProps) {
    return {
      registerInProgress: state.registerInProgress,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
      register: (utln: string, password: string) => {dispatch(register(utln, password))},
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
