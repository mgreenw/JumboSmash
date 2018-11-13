// @flow

import React from "react";
import { Image, View, Text } from "react-native";
import { Font } from "expo";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";

type Props = {
  navigation: any
};

type State = {
  appLoaded: boolean
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

// This component is the screen we see on initial app startup, as we are
// loading the state of the app / determining if the user is already logged in.
// If the user is logged in, we then navigate to App, otherwise to Auth.
class AppLoadingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      appLoaded: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: this should really be props once we have this through Redux
    if (this.state.appLoaded && this.state.appLoaded != prevState.appLoaded) {
      const { navigate } = this.props.navigation;
      navigate("Main", {});
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              color: "#ff6262",
              fontFamily: "vegan",
              fontSize: 44,
              padding: 15,
              textAlign: "center"
            }}
          >
            Project Gem
          </Text>{" "}
        </View>

        <View style={{ flex: 1 }}>
          <Image
            resizeMode="contain"
            style={{
              flex: 1,
              width: null,
              height: null
            }}
            source={require("../../assets/arthurIcon.png")} // TODO: investigate why  mobile/ does not work
          />{" "}
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLoadingScreen);
