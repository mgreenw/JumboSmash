// @flow

import React from "react";
import { Text, View, KeyboardAvoidingView, Image } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import {
  StackActions,
  NavigationActions,
  HeaderBackButton
} from "react-navigation";
import { styles } from "mobile/styles/auth";
import sendVerificationEmail from "mobile/api/auth/sendVerificationEmail";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { routes } from "mobile/components/Navigation";

type Props = {
  navigation: any
};

type State = {
  isSubmitting: boolean
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class ExpiredCodeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSubmitting: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    //if no param value then we just navigated to the page so we should show the back button
    const shouldShowButton = navigation.getParam("shouldShowButton", true);
    return {
      headerStyle: {
        borderBottomWidth: 0
      },
      headerLeft: shouldShowButton ? (
        <HeaderBackButton
          onPress={() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: routes.Splash })
              ]
            });
            navigation.dispatch(resetAction);
          }}
          disabled={true}
        />
      ) : null
    };
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isSubmitting != this.state.isSubmitting) {
      this.props.navigation.setParams({
        shouldShowButton: !this.state.isSubmitting
      });
    }
  }

  _onSuccess = (utln: string, email: string) => {
    const { navigate } = this.props.navigation;
    navigate(routes.Verify, {
      utln: utln,
      email: email
    });
  };

  _onError = () => {
    //TODO: Navigate to error screen
    console.log("error");
  };

  _onHelp = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.AuthHelp, {});
  };

  _onResend = () => {
    const { navigation } = this.props;
    const utln = navigation.getParam("utln", "");

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
        isSubmitting: true
      },
      () => {
        sendVerificationEmail(
          {
            utln,
            forceResend: true
          },
          (response, request) =>
            stopSubmitting(() => {
              this._onSuccess(request.utln, response.email);
            }),
          (response, request) => stopSubmitting(this._onError),
          (response, request) => stopSubmitting(this._onError),
          (response, request) =>
            stopSubmitting(() => {
              this._onSuccess(request.utln, response.email);
            }),
          (error, request) => stopSubmitting(this._onError)
        );
      }
    );
  };

  render() {
    const { navigation } = this.props;
    const email = navigation.getParam("email", "");

    return (
      <View style={Arthur_Styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Expired Verification Code</Text>
        </View>
        <View>
          <Text
          >{`Your email verification code has expired. To sign in, have a new code sent to ${email}`}</Text>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch" }}>
          <Button
            buttonStyle={styles.button}
            onPress={this._onResend}
            title="Resend Code"
            disabled={this.state.isSubmitting}
            loading={this.state.isSubmitting}
          />
        </View>
        <Button
          buttonStyle={styles.button}
          onPress={this._onHelp}
          title="help"
        />
        <Image
          resizeMode="stretch"
          source={require("../../../assets/waves/waves1/waves.png")}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "100%"
          }}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpiredCodeScreen);
