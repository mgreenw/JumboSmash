// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { sendVerificationEmail } from '../../actions/auth';
import type { apiResponse } from '../../actions/apiResponse';

type Props = {
  navigation: any,
  sendVerificationEmail_Action: (utln: string) => void,
  sendVerificationEmail_Response: ?apiResponse,
  sendVerificationEmail_InProgress: boolean,
};

type State = {
  utln: string,
  valid: {
    utln: boolean,
  },
  errorMessage: {
    utln: string,
  }
}

function mapStateToProps(state, ownProps) {
  console.log(state);
    return {};
}

function mapDispatchToProps(dispatch, ownProps) {
    return {};
}

class SplashScreen extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        utln: '',
        valid: {
          utln: true,
        },
        errorMessage: {
          utln: '',
        }
      }
    }

    // These are for react navigation, like header bar and such
    static navigationOptions = {
      header: null,
    };

    // Not needed for this component b/c root of stack, but theoretically all headers
    // need this on buttons with stack influencing callbacks.

    // componentDidUpdate(prevProps) {
    //   if (prevProps.registerInProgress != this.props.registerInProgress) {
    //     this.props.navigation.setParams({
    //       headerLeft: this.props.registerInProgress ? null : ''});
    //   }
    // }

    // for refs
    utlnInput: Input;

    _onSubmit = () => {
        const { navigate } = this.props.navigation;
        if (this._validateUtln()) {
          this.props.sendVerificationEmail_Action(this.state.utln);
          // navigate('Verify', {})
        }
    }

    _validateUtln = () => {
      let _valid = {
        utln: true,
      }

      let _errorMessage = {
        utln: '',
      }

      if (this.state.utln == '') {
        this.utlnInput.shake();
        _valid.utln = false;
        _errorMessage.utln = 'Required'
      }

      this.setState({
        valid: _valid,
        errorMessage: _errorMessage,
      });
      return (_valid.utln);
    };

    render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
            <KeyboardAvoidingView
              style={styles.container}
              behavior="padding"
              >
                <View style={{flex: 1}}>
                    <Text style={styles.title}>PROJECT GEM</Text>
                </View>
                  <View style={{flex: 1, alignSelf: 'stretch', width: '100%',}}>
                    <Input
                      containerStyle={this.state.valid.utln
                        ? styles.inputWrapperStyle
                        : styles.inputWrapperStyleWithError}
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
                  <View style={{flex: 1, alignSelf: 'stretch'}}>
                    <Button
                      buttonStyle={styles.button}
                      onPress = {() => {this._onSubmit()}}
                      title="submit"
                      disabled = {this.props.sendVerificationEmail_InProgress}
                      loading= {this.props.sendVerificationEmail_InProgress}
                    />
                  </View>
          </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
  container : {
      flex: 1,
      backgroundColor: '#FFF',
      padding: 30,
      alignSelf: 'stretch',
  },
  title: {
      fontSize: 50,
      letterSpacing: 3,
      textAlign: 'center',
  },
  button: {
    height: 40,
  },
  inputWrapperStyle: {
    height: 60,
    width: '100%',
  },
  inputWrapperStyleWithError: {
    height: 80,
    width: '100%',
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
    paddingTop: 5,
    paddingBottom: 10,
  }
});

function mapStateToProps(state, ownProps) {
    return {
      sendVerificationEmail_InProgress: state.sendVerificationEmail_InProgress,
      sendVerificationEmail_Response: state.sendVerificationEmail_Response,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
      sendVerificationEmail_Action: (utln: string) => {dispatch(sendVerificationEmail(utln))},
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
