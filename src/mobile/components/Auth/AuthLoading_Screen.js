// @flow

import React from "react";
import { Image, View } from "react-native";
import { StackNavigator } from "react-navigation";
import { Font } from "expo";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import getTokenUtln from "mobile/api/auth/getTokenUtln";
import { loadAuth } from "mobile/actions/auth/loadAuth";
import { login } from "mobile/actions/auth/login";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";

type Props = {
  navigation: any,

  // Redux state
  loadAuthInProgress: boolean, // redux state for action in progress
  authLoaded: boolean,
  loggedIn: boolean,

  // Actions
  loadAuth: void => void,
  login: (utln: string, token: string) => void,

  // Async store -> Redux
  utln: string,
  token: string
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {
    utln: reduxState.utln,
    token: reduxState.token,
    loadAuthInProgress: reduxState.inProgress.loadAuth,
    loggedIn: reduxState.loggedIn,
    authLoaded: reduxState.authLoaded
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {
    loadAuth: () => {
      dispatch(loadAuth());
    },
    login: (utln: string, token: string) => {
      dispatch(login(utln, token));
    }
  };
}

// This component is the screen we see on initial app startup, as we are
// loading the state of the app / determining if the user is already logged in.
// If the user is logged in, we then navigate to App, otherwise to Auth.
class AuthLoadingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
    Font.loadAsync({
      vegan: require("../../assets/fonts/vegan.ttf")
    }).then(this.props.loadAuth);
  }

  componentDidUpdate(prevProps, prevState) {
    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (prevProps.loadAuthInProgress != this.props.loadAuthInProgress) {
      if (this.props.authLoaded) {
        const { utln, token } = this.props;
        if (utln && token) {
          getTokenUtln(
            {
              token
            },
            (response, request) => {
              // Check if the server's utln is the same as one we have stored on device.
              // If not, invalidate the token (navigate to the auth screen).
              // This will fail if the stored UTLN is not exactly equal to the
              // server's utln
              const lowercaseUtln = utln.toLowerCase();
              const lowercaseResponseUtln = response.utln.toLowerCase();
              if (lowercaseUtln !== lowercaseResponseUtln) {
                this._onInvalidToken();
              } else {
                this._onValidToken(lowercaseUtln, token);
              }
            },
            (response, request) => {
              this._onInvalidToken();
            },
            // Treat any errors as an invalid token, make them log in
            (response, request) => {
              this._onInvalidToken();
            }
          );
        } else {
          this._onInvalidToken();
        }
      }
    }

    // for receiving completion of login action
    if (prevProps.loggedIn != this.props.loggedIn && this.props.loggedIn) {
      const { navigate } = this.props.navigation;
      navigate(routes.AppSwitch, {});
    }
  }

  // If the token is valid, we want to trigger login logic, so we must dispatch
  // login first.
  _onValidToken = (utln: string, token: string) => {
    this.props.login(utln, token);
  };

  // If the token is invalid, we don't need to set any more state, because
  // our redux state defaults being logged out, so we go straight to auth.
  _onInvalidToken = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.LoginStack);
  };

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1 }}>
          <Image
            resizeMode="contain"
            style={{
              flex: 1,
              width: null,
              height: null
            }}
            source={require("../../assets/arthurIcon.png")} // TODO: investigate why  mobile/ does not work
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);
