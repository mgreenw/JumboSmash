// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, View, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button, Input, Text } from 'react-native-elements';
import { connect } from 'react-redux';


import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  navigation: any,
  register: (utln: string, password: string) => void,
  registerInProgress: boolean,
};

type State = {
  utln: string,
  password: string,
  valid: {
    utln: boolean,
    password: boolean,
  },
  errorMessage: {
    utln: string,
    password: string,
  }
}

class SignupScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
      this.state = {
        utln: '',
        password: '',

        // all valid so that we don't shake the first time.
        valid: {
          utln: true,
          password: true,
        },
        errorMessage: {
          utln: '',
          password: '',
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
        }

      let _errorMessage = {
        utln: '',
        password: '',
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

        this.setState({valid: _valid, errorMessage: _errorMessage});
        return (_valid.utln && _valid.password);
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
                  >
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Input
                      containerStyle={this.state.valid.utln ? styles.inputWrapperStyle : styles.inputWrapperStyleWithError}
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
                    {
                      this.state.valid.utln &&
                      <View style={styles.helpTextContainer}>
                        <Text style={styles.helpText}>
                          Ex: jjaffe01
                        </Text>
                      </View>
                    }
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Input
                      secureTextEntry={true} // For Password
                      containerStyle={this.state.valid.password ? styles.inputWrapperStyle : styles.inputWrapperStyleWithError}
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
                    {
                      this.state.valid.password &&
                      <View style = {styles.helpTextContainer}>
                        <Text style={styles.helpText}>
                          At least 8 letters and nothing obvious (like "password")
                        </Text>
                      </View>
                    }
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Button
                      containerStyle={{justifyContent: 'center'}}
                      buttonStyle={styles.button}
                      onPress = {() => {this._onSignUp()}}
                      title="Sign Up"
                      disabled = {this.props.registerInProgress}
                      loading= {this.props.registerInProgress}
                    />
                  </View>
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

function mapStateToProps(state, ownProps) {
    return {
      registerInProgress: state.registerInProgress,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
      //register: (utln: string, password: string) => {dispatch(register(utln, password))},
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
