// @flow
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../../reducers/index";
import { styles } from "../../../styles/template";

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

class SettingsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {}

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => ({
    headerLeft: navigation.state.params.headerLeft,
    title: "Edit Profile"
  });

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        // Pictures:
        <View style={{ flex: 1, backgroundColor: "orange", padding: 5 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "blue",
              padding: 5
            }}
          >
            <View style={{ flex: 1, backgroundColor: "green" }} />
            <View style={{ flex: 1, backgroundColor: "purple" }} />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "yellow",
              padding: 5
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "brown",
                aspectRatio: 1
              }}
            />
            <View style={{ flex: 1, backgroundColor: "grey" }} />
          </View>
        </View>
        // Bio:
        <View style={{ flex: 1, backgroundColor: "red" }} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
