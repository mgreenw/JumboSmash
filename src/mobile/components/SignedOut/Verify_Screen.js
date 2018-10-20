// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { styles } from '../../styles/auth';
import verify from '../../api/auth/verify';

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
};

function mapStateToProps(state, ownProps) {
    return {};
}

function mapDispatchToProps(dispatch, ownProps) {
    return {};
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

    // TODO: verify request
    _onSubmit = () => {
      if (!this._validateUtln()) {
        return;
      }
      const { navigation } = this.props;
      const utln = navigation.getParam('utln', '')
      this.setState({
        isSubmitting: true,
        validCode: true,
        errorMessageCode: '',
      });

      const stopSubmitting = (callBack: () => void) => {
        this.setState({
          isSubmitting: false,
        }, callBack());
      }

      setTimeout(() => {
      verify(
        utln,
        this.state.code,
        (response) => { stopSubmitting(() => {}) }, // TODO
        (response) => { stopSubmitting(() => this._codeInputError('Incorrect verification code')) },
        (response) => { stopSubmitting(() => this._codeInputError('Expired code')) },
        (response) => { stopSubmitting(() => this._codeInputError('No email sent for UTLN: ' + response.utln)) },
        (response) => { stopSubmitting(() => this._codeInputError('Could not verify')) },
      )
    },
    3000);
  }

    codeInput: Input;

    render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;
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

function mapStateToProps(state, ownProps) {
    return {};
}

function mapDispatchToProps(dispatch, ownProps) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
