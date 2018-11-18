// @flow

import React from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView
} from "react-native";
import { StackNavigator } from "react-navigation";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/auth";
import verify from "mobile/api/auth/verify";
import { login } from "mobile/actions/auth/login";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import { routes } from "mobile/components/Navigation";

type State = {
  code: string,
  validCode: boolean,
  errorMessageCode: string,
  verifyUtlnInProgress: boolean
};

type Props = {
  navigation: any,
  utln: string,
  loggedIn: boolean,
  loginInProgress: boolean,

  // dispatch function with token
  login: (utln: string, token: string) => void
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {
    loggedIn: reduxState.loggedIn,
    loginInProgress: reduxState.inProgress.login
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {
    login: (utln: string, token: string) => {
      dispatch(login(utln, token));
    }
  };
}

class SplashScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      code: "",
      validCode: true,
      errorMessageCode: "",
      verifyUtlnInProgress: false
    };
  }

  // IMPORTANT: must be like this in order for back button toggling!
  static navigationOptions = ({ navigation }) => ({
    headerLeft: navigation.state.params.headerLeft,
    title: "Verification"
  });

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.verifyUtlnInProgress != this.state.verifyUtlnInProgress ||
      prevProps.loginInProgress != this.props.loginInProgress
    ) {
      const isLoading =
        this.state.verifyUtlnInProgress || this.props.loginInProgress;
      this.props.navigation.setParams({
        headerLeft: isLoading ? null : ""
      });

      if (this.props.loggedIn) {
        const { navigate } = this.props.navigation;
        navigate(routes.AppSwitch, {});
      }
    }
  }

  _validateUtln = () => {
    if (this.state.code == "") {
      this._codeInputError("Required");
      return false;
    }
    return true;
  };

  _codeInputError = (errorMessage: string) => {
    this.codeInput.shake();
    this.setState({
      validCode: false,
      errorMessageCode: errorMessage
    });
  };

  _onExpiredCode = (utln: string, email: string) => {
    const { navigate } = this.props.navigation;
    navigate(routes.ExpiredCode, {
      utln: utln,
      email: email
    });
  };

  // When we submit, a few things happen.
  // First, we set the state of this component to have isSubmitting = true,
  // so that we lock the UI to disable going back, editting the fields,
  // clicking more things, etc. Essentially, causing a syncronous behavoir.
  //
  // Because we want to ensure the request completes before continuing, we
  // assign a callback for EACH CASE of the possible responses (as defined
  // by the contract of the 'verify' function.)
  //
  // E.g. On success, we login to the app with credentials, or on failure
  // we display an appropriate message.
  _onSubmit = () => {
    if (!this._validateUtln()) {
      return;
    }
    const { navigation } = this.props;
    const utln = navigation.getParam("utln", "");
    const email = navigation.getParam("email", "");
    const stopSubmitting = (callBack: () => void) => {
      this.setState(
        {
          verifyUtlnInProgress: false
        },
        callBack
      );
    };
    this.setState(
      {
        verifyUtlnInProgress: true,
        validCode: true,
        errorMessageCode: ""
      },
      () => {
        verify(
          {
            utln: utln,
            code: this.state.code
          },
          (response, request) => {
            stopSubmitting(() => {
              this.props.login(utln, response.token);
            });
          },
          (response, request) => {
            stopSubmitting(() =>
              this._codeInputError("Incorrect verification code")
            );
          },
          (response, request) => {
            stopSubmitting(() => this._onExpiredCode(utln, email));
          },
          (response, request) => {
            stopSubmitting(() =>
              this._codeInputError("No email sent for UTLN: " + request.utln)
            );
          },
          (error, request) => {
            stopSubmitting(() => this._codeInputError("Could not verify"));
          }
        );
      }
    );
  };

  codeInput: Input;

  render() {
    const { navigation } = this.props;
    const email = navigation.getParam("email", "");
    const alreadySent = navigation.getParam("alreadySent", false);
    const isLoading =
      this.state.verifyUtlnInProgress || this.props.loginInProgress;

    const message = alreadySent
      ? `Looks like you've already been sent an email to ${email}.`
      : `A verification code has been sent to ${email}.`;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={{ flex: 1 }}>
          <Text>{message}</Text>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch", width: "100%" }}>
          <Input
            containerStyle={
              this.state.validCode
                ? styles.inputWrapperStyle
                : styles.inputWrapperStyleWithError
            }
            keyboardType="numeric"
            placeholderTextColor={"#DDDDDD"}
            inputStyle={{ color: "#222222" }}
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            label="Verification Code"
            placeholder=""
            onChangeText={text => this.setState({ code: text })}
            ref={input => (this.codeInput = input)}
            errorMessage={
              this.state.validCode ? "" : this.state.errorMessageCode
            }
            autoCorrect={false}
          />
          {this.state.validCode && (
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpText}>Ex: 123456</Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, alignSelf: "stretch" }}>
          <PrimaryButton
            onPress={this._onSubmit}
            title="submit"
            disabled={isLoading || this.state.code == ""}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
