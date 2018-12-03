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
import { connect } from "react-redux";
import { styles } from "mobile/styles/auth";
import sendVerificationEmail from "mobile/api/auth/sendVerificationEmail";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import { routes } from "mobile/components/Navigation";

type Props = {
  navigation: any
};

type State = {
  utln: string,
  validUtln: boolean,
  errorMessageUtln: string,
  isSubmitting: boolean
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class SplashScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      utln: "",
      validUtln: true,
      errorMessageUtln: "",
      isSubmitting: false
    };
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

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

  _onError = (error: any) => {
    this._onNotFound();
  };

  _onHelp = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.AuthHelp, {});
  };

  _onSubmit = () => {
    // First, we validate the UTLN to preliminarily shake it / display errors
    if (this._validateUtln()) {
      const stopSubmitting = (callBack: any => void) => {
        this.setState(
          {
            isSubmitting: false
          },
          callBack()
        );
      };

      this.setState(
        {
          isSubmitting: true,
          validUtln: true,
          errorMessageUtln: ""
        },
        () => {
          sendVerificationEmail(
            { utln: this.state.utln },
            (response, request) =>
              stopSubmitting(() => {
                this._onSuccess(request.utln, response.email, false);
              }),
            (response, request) =>
              stopSubmitting(() => {
                this._onNot2019(response.classYear);
              }),
            (response, request) => stopSubmitting(this._onNotFound),
            (response, request) =>
              stopSubmitting(() => {
                this._onSuccess(request.utln, response.email, true);
              }),
            (error, request) =>
              stopSubmitting(() => {
                this._onError(error);
              })
          );
        }
      );
    }
  };

  _utlnInputError = (errorMessage: string) => {
    this.utlnInput.shake();
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

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <KeyboardAvoidingView
        style={Arthur_Styles.container}
        behavior="padding"
        keyboardShouldPersistTaps={"handled"}
      >
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}
          accessible={false}
        >
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
              <Input
                containerStyle={
                  this.state.validUtln
                    ? styles.inputWrapperStyle
                    : styles.inputWrapperStyleWithError
                }
                placeholderTextColor={"#DDDDDD"}
                inputStyle={{ color: "#222222" }}
                labelStyle={styles.labelStyle}
                inputContainerStyle={styles.inputContainerStyle}
                label="Tufts UTLN"
                placeholder="amonac01"
                onChangeText={text =>
                  this.setState({ utln: text.toLowerCase() })
                }
                ref={input => (this.utlnInput = input)}
                errorMessage={
                  this.state.validUtln ? "" : this.state.errorMessageUtln
                }
                autoCorrect={false}
                autoCapitalize="none"
              />
              {this.state.validUtln && (
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpText}>Ex: jjaffe01</Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1 }}>
                <PrimaryButton
                  onPress={this._onSubmit}
                  title="Roll 'Bos'"
                  disabled={this.state.isSubmitting || this.state.utln == ""}
                  loading={this.state.isSubmitting}
                />
                <Button onPress={this._onHelp} title="help" />
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Image
          resizeMode="stretch"
          source={require("../../../assets/waves/waves1/waves.png")}
          style={Arthur_Styles.waves}
        />
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
