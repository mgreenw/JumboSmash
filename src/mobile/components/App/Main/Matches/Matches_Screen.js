// @flow

import React from "react";
import { Text, View, Switch } from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { Transition } from "react-navigation-fluid-transitions";
import GEMHeader from "mobile/components/shared/Header";

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

class MessagingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <Transition inline appear={"right"}>
        <View style={{ flex: 1 }}>
          <GEMHeader title="matches" leftIconName={"cards"} />
          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>PROJECT GEM: MESSAGING</Text>
            </View>
          </View>
        </View>
      </Transition>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
