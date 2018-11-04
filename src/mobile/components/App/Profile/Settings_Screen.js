// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { styles } from "../../../styles/template";
import { logout } from "../../../actions/auth/logout";

type Props = {
  navigation: any,
  logout_inProgress: boolean,
  loggedIn: boolean,
  logout: () => void
};

type State = {};

function mapStateToProps(state, ownProps) {
  return {
    logout_inProgress: state.logout_inProgress,
    loggedIn: state.loggedIn
  };
}

function mapDispatchToProps(dispatch, ownProps) {
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
    if (prevProps.logout_inProgress != this.props.logout_inProgress) {
      // disable back button when performing a syncronous action.
      this.props.navigation.setParams({
        headerLeft: this.props.logout_inProgress ? null : ""
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
            disabled={this.props.logout_inProgress}
            loading={this.props.logout_inProgress}
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
