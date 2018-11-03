// @flow

import React from "react";
import { Alert, ActivityIndicator, StatusBar, Text, View } from "react-native";
import { StackNavigator } from "react-navigation";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import getTokenUtln from "../api/auth/getTokenUtln";
import { loadAuth } from "../actions/auth/loadAuth";

type Props = {
  navigation: any,
  loadingAuth: boolean, // redux state for action in progress
  loadAuth: void => void,
  utln: string,
  token: string
};

type State = {};

function mapStateToProps(state, ownProps: Props) {
  return {
    utln: state.utln,
    token: state.token,
    loadingAuth: state.loadingAuth
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {
    loadAuth: () => {
      dispatch(loadAuth());
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

    // TODO: remove debugging timeout / make a nice loading screen animation
    setTimeout(this.props.loadAuth, 2000);
  }

  componentDidUpdate(prevProps, prevState) {
    // loadingAuth WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (prevProps.loadingAuth != this.props.loadingAuth) {
      // If loadingAuth is false, then the async storage load has completed
      if (!this.props.loadingAuth) {
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
              if (utln !== response.utln) {
                this._onInvalidToken();
              } else {
                this._onValidToken();
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
  }

  _onValidToken = () => {
    const { navigate } = this.props.navigation;
    navigate("App");
  };

  _onInvalidToken = () => {
    const { navigate } = this.props.navigation;
    navigate("Auth");
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>PROJECT GEM</Text>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);
