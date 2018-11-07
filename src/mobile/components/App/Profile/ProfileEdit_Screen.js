// @flow
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../../reducers/index";

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
      <View style={styles.pictureRows}>
        <View style={styles.pictureRow}>
          <View style={styles.fixedRatio} />
          <View style={styles.fixedRatio2} />
        </View>
        <View style={styles.pictureRow}>
          <View style={styles.fixedRatio2} />
          <View style={styles.fixedRatio3} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pictureRows: {
    flex: 1
  },
  pictureRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  fixedRatio: {
    backgroundColor: "rebeccapurple",
    flex: 1,
    aspectRatio: 1
  },
  fixedRatio2: {
    backgroundColor: "red",
    flex: 1,
    aspectRatio: 1
  },
  fixedRatio3: {
    backgroundColor: "blue",
    flex: 1,
    aspectRatio: 1
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
