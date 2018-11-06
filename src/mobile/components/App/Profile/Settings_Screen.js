// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { styles } from "../../../styles/template";
import { logout } from "../../../actions/auth/logout";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../../reducers/index";

type Props = {
  navigation: any,
  logoutInProgress: boolean,
  loggedIn: boolean,
  logout: () => void
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {
    logoutInProgress: reduxState.inProgress.logout,
    loggedIn: reduxState.loggedIn
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {
    logout: () => {
      dispatch(logout());
    }
  };
}

class SettingsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.logoutInProgress != this.props.logoutInProgress) {
      // disable back button when performing a syncronous action.
      this.props.navigation.setParams({
        headerLeft: this.props.logoutInProgress ? null : ""
      });

      // For recieving the logout completion
      if (!this.props.loggedIn) {
        const { navigate } = this.props.navigation;
        navigate("Splash", {});
      }
    }
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => ({
    headerLeft: navigation.state.params.headerLeft,
    title: "Settings"
  });

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>PROJECT GEM: SETTINGS</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Log Out"
            buttonStyle={styles.button}
            onPress={this.props.logout}
            disabled={this.props.logoutInProgress}
            loading={this.props.logoutInProgress}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
