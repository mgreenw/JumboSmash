// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { styles } from '../../styles/auth';
import sendVerificationEmail from '../../api/auth/sendVerificationEmail';

type Props = {
  navigation: any,
};

type State = {
  utln: string,
  validUtln: boolean,
  errorMessageUtln: string,
  isSubmitting: boolean,
}

function mapStateToProps(state: State, ownProps: Props) {
    return {};
}

function mapDispatchToProps(dispatch: State, ownProps: Props) {
    return {};
}

class SplashScreen extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        utln: '',
        validUtln: true,
        errorMessageUtln: '',
        isSubmitting: false,
      }
    }

    // These are for react navigation, like header bar and such
    static navigationOptions = {
      headerStyle: {
          borderBottomWidth: 0,
      }
    };

    // for refs
    utlnInput: Input;

    _onSubmit = () => {
        // First, we validate the UTLN to preliminarily shake it / display errors
        if (this._validateUtln()) {
          const { navigate } = this.props.navigation;
          this.setState({
            isSubmitting: true,
            validUtln: true,
            errorMessageUtln: '',
          });
          const stopSubmitting = (callBack: () => void) => {
            this.setState({
              isSubmitting: false,
            }, callBack());
          }

          // TODO: consider refactoring into own functions; however, we lose
          // this easy type inference...
          // Could do be having it be the callbacks to stopSubmitting, so they
          // take direct args, not the full repsonse?
          sendVerificationEmail(
            this.state.utln,

            // SUCCESS
            // Stop submitting (incase goes back), then navigate.
            (response) => {
              stopSubmitting(() => {
                navigate('Verify', {
                  utln: this.state.utln,
                  email: response.email,
                });
              })},

              // NOT_2019
              (response) => {
                stopSubmitting(() => {
                  this._utlnInputError('Sorry, this is only for Seniors!');
                });
              },

              // NOT_FOUND
              (response) => {
                stopSubmitting(() => {
                  this._utlnInputError('Could not find UTLN');
                });
              },

              // TOO_MANY_REQUESTS
              (response) => {
                stopSubmitting(() => {
                  const diffMins = -1;
                  this._utlnInputError(
                    "Sorry, you've sent too many requests. \
                    Please check your email or try again in "
                    + diffMins + " minutes.");
                });
              },

              // UNCAUGHT (Includes Timemouts, Server errors, Network errors...)
              (error) => {
                stopSubmitting(() => {
                  console.log('uncaught error:', error);
                  this._utlnInputError('Could not find UTLN');
                });
              }
            );
        }
    }

    _utlnInputError = (errorMessage: string) => {
      this.utlnInput.shake();
      this.setState({
        validUtln: false,
        errorMessageUtln: errorMessage,
      });
    }

    // TODO: more client side validation!
    _validateUtln = () => {
      if (this.state.utln == '') {
        this._utlnInputError('Required');
        return false;
      }
      return (true);
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
                      containerStyle={this.state.validUtln
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
                      errorMessage = {this.state.validUtln ? '' : this.state.errorMessageUtln}
                      autoCorrect={false}
                    />
                    {
                      this.state.validUtln &&
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
                      disabled = {this.state.isSubmitting}
                      loading= {this.state.isSubmitting}
                    />
                  </View>
          </KeyboardAvoidingView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
