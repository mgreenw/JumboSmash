// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { styles } from "../../../styles/template";
import { logout } from "../../../actions/auth/logout";

type Props = {
  navigation: any,
  loggedIn: boolean,

  logout: () => void
};

type State = {
  isLoggingOut: boolean
};

function mapStateToProps(state, ownProps) {
  return {
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
    this.state = {
      isLoggingOut: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isLoggingOut != this.state.isLoggingOut) {
      // disable back button when performing a syncronous action.
      this.props.navigation.setParams({
        headerLeft: this.state.isLoggingOut ? null : ""
      });
    }

    // For recieving the logout completion
    if (!this.props.loggedIn) {
      const { navigate } = this.props.navigation;
      setTimeout(() => {
        navigate("Splash", {});
      }, 2000);
    }
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => ({
    headerLeft: navigation.state.params.headerLeft,
    title: "Settings"
  });

  _onLogOutPress = () => {
    this.setState(
      {
        isLoggingOut: true
      },
      this.props.logout
    );
  };

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
            onPress={this._onLogOutPress}
            disabled={this.state.isLoggingOut}
            loading={this.state.isLoggingOut}
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
