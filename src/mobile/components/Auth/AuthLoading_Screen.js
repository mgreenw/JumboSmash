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
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { routes } from "mobile/components/Navigation";

type reduxProps = {
  token: ?string,
  loadAuthInProgress: boolean,
  authLoaded: boolean,
  loggedIn: boolean
};

type navigationProps = {
  navigation: any
};

type dispatchProps = {
  loadAuth: void => void,
  login: (token: string) => void
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  return {
    token: reduxState.token,
    loadAuthInProgress: reduxState.inProgress.loadAuth,
    loggedIn: reduxState.loggedIn,
    authLoaded: reduxState.authLoaded
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): dispatchProps {
  return {
    loadAuth: () => {
      dispatch(loadAuth());
    },
    login: (token: string) => {
      dispatch(login(token));
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
    Promise.all([
      Font.loadAsync({
        vegan: require("../../assets/fonts/vegan.ttf")
      }),
      Font.loadAsync({
        SourceSansPro: require("../../assets/fonts/SourceSansPro-Regular.ttf")
      }),
      Font.loadAsync({
        gemicons: require("../../assets/icons/gemicons.ttf")
      })
    ])
      .then(results => {
        this.props.loadAuth();
      })
      .catch(e => {
        // $FlowFixMe (__DEV__ will break flow)
        if (__DEV__) {
          console.log("Error importing fonts:", e);
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (prevProps.loadAuthInProgress != this.props.loadAuthInProgress) {
      if (this.props.authLoaded) {
        const { token } = this.props;
        if (token) {
          getTokenUtln(
            {
              token
            },
            (response, request) => {
              this._onValidToken(token);
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
  _onValidToken = (token: string) => {
    this.props.login(token);
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
