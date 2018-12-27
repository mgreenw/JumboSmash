// @flow

import React from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  TextInput,
  Text,
  Image,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { StackNavigator } from "react-navigation";
import { Button, Input } from "react-native-elements";
import { PrimaryInput } from "mobile/components/shared/PrimaryInput";
import { connect } from "react-redux";
import { styles } from "mobile/styles/auth";
import { sendVerificationEmail } from "mobile/actions/auth/sendVerificationEmail";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import { TertiaryButton } from "mobile/components/shared/TertiaryButton";
import { routes } from "mobile/components/Navigation";
import { KeyboardView } from "mobile/components/shared/KeyboardView";
import type { sendVerificationEmail_response } from "mobile/actions/auth/sendVerificationEmail";
import { Transition } from "react-navigation-fluid-transitions";
import GEMHeader from "mobile/components/shared/Header";

type reduxProps = {
  sendVerificationEmail_inProgress: boolean,
  sendVerificationEmail_response: ?sendVerificationEmail_response
};

type navigationProps = {
  navigation: any
};

type dispatchProps = {
  sendVerificationEmail: (utln: string) => void
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
  utln: string,
  validUtln: boolean,
  errorMessageUtln: string
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  return {
    sendVerificationEmail_inProgress:
      reduxState.inProgress.sendVerificationEmail,
    sendVerificationEmail_response: reduxState.response.sendVerificationEmail
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): dispatchProps {
  return {
    // no need for force resend here.
    sendVerificationEmail: utln => {
      dispatch(sendVerificationEmail(utln, false));
    }
  };
}

class SplashScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      utln: "",
      validUtln: true,
      errorMessageUtln: ""
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.sendVerificationEmail_inProgress !=
        this.props.sendVerificationEmail_inProgress &&
      !this.props.sendVerificationEmail_inProgress
    ) {
      const response = this.props.sendVerificationEmail_response;
      if (!response) {
        throw "Error in Login: Send Verification Email complete but no response";
      }
      switch (response.statusCode) {
        case "SUCCESS": {
          this._onSuccess(response.utln, response.email, false);
          break;
        }
        case "ALREADY_SENT": {
          this._onSuccess(response.utln, response.email, true);
          break;
        }
        case "WRONG_CLASS_YEAR": {
          this._onNot2019(response.classYear);
        }
        // TODO: maybe this needs its own case or be part of Not_2019?
        case "NOT_STUDENT": {
          this._onNotFound();
          break;
        }
        case "NOT_FOUND": {
          this._onNotFound();
          break;
        }
      }
    }
  }
  // for refs
  utlnInput: Input;

  // utln and email should be params, not from state, to ensure it's the
  // same that were submitted!
  _onSuccess = (utln: string, email: string, alreadySent: boolean) => {
    const { navigate } = this.props.navigation;
    navigate(routes.Verify, {
      utln: utln,
      email: email,
      alreadySent: alreadySent
    });
  };

  _onNot2019 = (classYear: string) => {
    const { navigate } = this.props.navigation;
    navigate(routes.Not2019, {
      classYear: classYear
    });
  };

  _onNotFound = () => {
    this._utlnInputError("Could not find UTLN");
  };

  _onHelp = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.AuthHelp, {});
  };

  _onSubmit = () => {
    // First, we validate the UTLN to preliminarily display errors
    if (this._validateUtln()) {
      this.setState(
        {
          validUtln: true,
          errorMessageUtln: ""
        },
        () => {
          this.props.sendVerificationEmail(this.state.utln);
        }
      );
    }
  };

  _utlnInputError = (errorMessage: string) => {
    this.setState({
      validUtln: false,
      errorMessageUtln: errorMessage
    });
  };

  // TODO: more client side validation!
  _validateUtln = () => {
    if (this.state.utln == "") {
      this._utlnInputError("Required");
      return false;
    }
    return true;
  };

  _onInputChange = (text: string) => {
    const utln = text.toLowerCase();
    if (utln !== this.state.utln && !this.state.validUtln) {
      this.setState({
        validUtln: true,
        errorMessageUtln: "",
        utln
      });
    } else {
      this.setState({ utln });
    }
  };

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <View style={Arthur_Styles.container}>
        <View style={{ height: 64 }} />
        <KeyboardView waves={1}>
          <Transition inline appear={"horizontal"}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 2, alignItems: "center" }}>
                <Text style={Arthur_Styles.title}>Project Gem</Text>
                <Image
                  resizeMode="contain"
                  style={{
                    flex: 1,
                    maxWidth: "60%"
                  }}
                  source={require("../../../assets/arthurIcon.png")} // TODO: investigate why mobile/ does not work
                />
                <PrimaryInput
                  label="UTLN"
                  onChange={this._onInputChange}
                  error={this.state.errorMessageUtln}
                  assitive="Ex: jjaffe01"
                  errorMessage={
                    this.state.validUtln ? "" : this.state.errorMessageUtln
                  }
                  containerStyle={{ width: "60%" }}
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
                    title="Roll 'Bos'"
                    disabled={
                      this.props.sendVerificationEmail_inProgress ||
                      this.state.utln == ""
                    }
                    loading={this.props.sendVerificationEmail_inProgress}
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
