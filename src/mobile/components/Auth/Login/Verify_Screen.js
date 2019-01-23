// @flow

import React from "react";
import { Linking, StyleSheet, TextInput, Text, View } from "react-native";
import { StackNavigator } from "react-navigation";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/auth";
import verify from "mobile/api/auth/verify";
import { login } from "mobile/actions/auth/login";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { Colors } from "mobile/styles/colors";
import { textStyles } from "mobile/styles/textStyles";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import { TertiaryButton } from "mobile/components/shared/TertiaryButton";
import { CodeInput } from "mobile/components/shared/DigitInput";
import { routes } from "mobile/components/Navigation";
import { KeyboardView } from "mobile/components/shared/KeyboardView";
import type { login_response } from "mobile/actions/auth/login";
import { Transition } from "react-navigation-fluid-transitions";
import GEMHeader from "mobile/components/shared/Header";

const NUM_DIGITS = 6;

type State = {
  code: string,
  validCode: boolean,
  errorMessageCode: string,
  verifyUtlnInProgress: boolean
};

type reduxProps = {
  login_inProgress: boolean,
  login_response: ?login_response
};
type navigationProps = {
  navigation: any
};
type dispatchProps = {
  login: (utln: string, code: string) => void
};

type Props = reduxProps & navigationProps & dispatchProps;

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  return {
    login_inProgress: reduxState.inProgress.login,
    login_response: reduxState.response.login
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): dispatchProps {
  return {
    login: (utln, code) => {
      dispatch(login(utln, code));
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.login_inProgress != this.props.login_inProgress) {
      if (!this.props.login_inProgress && this.props.login_response) {
        const { navigate } = this.props.navigation;
        if (this.props.login_response.statusCode === "SUCCESS") {
          navigate(routes.AppSwitch, {});
        } else {
          // TODO: more verbose errors
          this._codeInputError(this.props.login_response.statusCode);
        }
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

  _onHelp = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.AuthHelp, {});
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
    const utln = navigation.getParam("utln", null);
    const email = navigation.getParam("email", null);
    if (!utln || !email) {
      throw ("Error in Verify Screen: utln or email null: ", utln, email);
    }
    this.setState(
      {
        validCode: true,
        errorMessageCode: ""
      },
      () => {
        this.props.login(utln, this.state.code);
      }
    );
  };

  _onChangeText = (text: string) => {
    this.setState({ code: text, validCode: true, errorMessageCode: "" });
  };

  render() {
    const { navigation } = this.props;
    const email = navigation.getParam("email", "");
    const alreadySent = navigation.getParam("alreadySent", false);
    const isLoading = this.props.login_inProgress;

    const message = alreadySent
      ? `Looks like you've already been sent an email to ${email}.`
      : `A verification code has been sent to ${email}.`;

    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader
          title={"Verification"}
          leftIconName={"back"}
          loading={isLoading}
        />
        <KeyboardView waves={1}>
          <Transition inline appear={"horizontal"}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Text style={textStyles.body1Style}>{message}</Text>
              </View>
              <View style={{ flex: 1, alignSelf: "stretch" }}>
                <CodeInput
                  value={this.state.code}
                  onChangeValue={this._onChangeText}
                  maxLength={NUM_DIGITS}
                  primaryColor={Colors.Black}
                  errorColor={Colors.Grapefruit}
                  error={this.state.errorMessageCode}
                  assistive={"Make sure to check your spam folder!"}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row"
                }}
              >
                <View style={{ flex: 1 }} />
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-around"
                  }}
                >
                  <PrimaryButton
                    onPress={this._onSubmit}
                    title="submit"
                    disabled={
                      isLoading || this.state.code.length !== NUM_DIGITS
                    }
                    loading={isLoading}
                  />
                  <TertiaryButton
                    onPress={this._onHelp}
                    title="Having Touble?"
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </Transition>
        </KeyboardView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
