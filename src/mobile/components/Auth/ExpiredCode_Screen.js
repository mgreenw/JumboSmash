// @flow

import React from "react";
import { Text, View, KeyboardAvoidingView } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import {
  StackActions,
  NavigationActions,
  HeaderBackButton
} from "react-navigation";
import { styles } from "../../styles/auth";
import sendVerificationEmail from "../../api/auth/sendVerificationEmail";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../reducers/index";

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
    return {
      headerStyle: {
        borderBottomWidth: 0
      },
      headerLeft: (
        <HeaderBackButton
          onPress={() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: "Splash" })]
            });
            navigation.dispatch(resetAction);
          }}
        />
      )
    };
  };

  _onSuccess = (utln: string, email: string) => {
    const { navigate } = this.props.navigation;
    navigate("Verify", {
      utln: utln,
      email: email
    });
  };

  _onNot2019 = (classYear: string) => {
    const { navigate } = this.props.navigation;
    navigate("Not2019", {
      classYear: classYear
    });
  };

  _onError = (error: any) => {
    console.log("error");
  };

  _onResend = () => {
    const { navigation } = this.props;
    const utln = navigation.getParam("utln", "");
    // First, we validate the UTLN to preliminarily shake it / display errors

    this.setState({
      isSubmitting: true
    });

    const stopSubmitting = (callBack: any => void) => {
      this.setState(
        {
          isSubmitting: false
        },
        callBack()
      );
    };

    // Not the best way to do this for the callbacks with parameters, but
    // marignally better than before. Need to find a better way to do this
    // with keeping response types.
    sendVerificationEmail(
      {
        utln,
        forceResend: true
      },
      (response, request) =>
        stopSubmitting(() => {
          this._onSuccess(request.utln, response.email);
        }),
      (response, request) =>
        stopSubmitting(() => {
          this._onNot2019(response.classYear);
        }),
      (response, request) => stopSubmitting(this._onError),
      (response, request) =>
        stopSubmitting(() => {
          this._onSuccess(request.utln, response.email);
        }),
      (error, request) =>
        stopSubmitting(() => {
          this._onError(error);
        })
    );
  };

  render() {
    const { navigation } = this.props;
    const email = navigation.getParam("email", "");

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
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
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpiredCodeScreen);
