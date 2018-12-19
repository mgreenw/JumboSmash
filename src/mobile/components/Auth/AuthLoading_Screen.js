// @flow

import React from "react";
import { Image, View } from "react-native";
import { StackNavigator } from "react-navigation";
import { Font } from "expo";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import getTokenUtln from "mobile/api/auth/getTokenUtln";
import { loadAuth } from "mobile/actions/auth/loadAuth";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { routes } from "mobile/components/Navigation";

type reduxProps = {
  token: ?string,
  loadAuthInProgress: boolean,
  authLoaded: boolean
};

type navigationProps = {
  navigation: any
};

type dispatchProps = {
  loadAuth: void => void
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  return {
    token: reduxState.token,
    loadAuthInProgress: reduxState.inProgress.loadAuth,
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
        vegan: require("../../assets/fonts/Vegan-Regular.ttf")
      }),
      Font.loadAsync({
        SourceSansPro: require("../../assets/fonts/SourceSansPro-Regular.ttf")
      }),
      Font.loadAsync({
        gemicons: require("../../assets/icons/gemicons.ttf")
      }),
      Font.loadAsync({
        AvenirNext: require("../../assets/fonts/AvenirNext-Regular.ttf")
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
    const { navigate } = this.props.navigation;

    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (prevProps.loadAuthInProgress != this.props.loadAuthInProgress) {
      if (this.props.authLoaded) {
        const { token } = this.props;
        // The token might be expired. This is caught upstream though in
        // by redux middleware.
        if (token) {
          navigate(routes.AppSwitch, {});
        } else {
          navigate(routes.LoginStack);
        }
      }
    }
  }

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
