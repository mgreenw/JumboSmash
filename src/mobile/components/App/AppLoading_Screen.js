// @flow

import React from "react";
import { Image, View, Text } from "react-native";
import { Font } from "expo";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Colors, Arthur_Styles } from "mobile/styles/Arthur_Styles";
import ProgressBar from "react-native-progress/Bar";

type Props = {
  navigation: any
};

type State = {};

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
    this.state = {};
    setTimeout(() => {
      const { navigate } = this.props.navigation;
      navigate("Main", {});
    }, 2000);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.title}>Project Gem</Text>
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
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "stretch",
            paddingLeft: 60,
            paddingRight: 60
          }}
        >
          <ProgressBar
            progress={0.3}
            height={10}
            unfilledColor={Colors.IceBlue}
            borderWidth={0}
            color={Colors.Grapefruit}
            indeterminate={true}
            borderRadius={6}
            width={null}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLoadingScreen);
