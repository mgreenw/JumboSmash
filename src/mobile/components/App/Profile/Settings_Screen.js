// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { styles } from "../../../styles/template";
import { logout } from "../../../actions/auth/logout";
import { PronounSelector } from "../assets/PronounSelector";
import type { Pronouns } from "../assets/PronounSelector";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../../reducers/index";

type Props = {
  navigation: any,
  logoutInProgress: boolean,
  loggedIn: boolean,
  logout: () => void
};

type State = {
  usePronouns: Pronouns,
  wantPronouns: Pronouns
};

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
    this.state = {
      isLoggingOut: false,
      // TODO: initialize via the redux state.
      usePronouns: {
        he: true,
        she: true,
        they: true
      },
      wantPronouns: {
        he: true,
        she: true,
        they: true
      }
    };
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

  _onUsePronounChange = (pronouns: Pronouns) => {
    this.setState({
      usePronouns: pronouns
    });
  };

  _onWantPronounChange = (pronouns: Pronouns) => {
    this.setState({
      wantPronouns: pronouns
    });
  };

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: "center" }}>Pronoun Preferences</Text>
          <Text style={{ textAlign: "center" }}>
            We use Pronouns to help determine who to show in your stack in
            Project GEM. Your pronouns will not be shown on your profile.
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: "center" }}>I use:</Text>
          <PronounSelector
            defaultPronouns={this.state.usePronouns}
            onChange={this._onUsePronounChange}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: "center" }}>I'm looking for:</Text>
          <PronounSelector
            defaultPronouns={this.state.wantPronouns}
            onChange={this._onWantPronounChange}
          />
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
