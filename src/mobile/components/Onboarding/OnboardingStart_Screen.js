// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { styles } from "../../styles/auth";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../reducers/index";

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

class OnboardingStartScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    },
    headerLeft: null
  };

  render() {
    return (
      <View style={{ flex: 1, alignSelf: "stretch", width: "100%" }}>
        <Text style={styles.title}>Start Onboarding</Text>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingStartScreen);
