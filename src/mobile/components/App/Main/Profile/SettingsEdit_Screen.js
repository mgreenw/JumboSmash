// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { styles } from "mobile/styles/template";
import { logout } from "mobile/actions/auth/logout";
import { GenderSelector } from "mobile/components/shared/GenderSelector";
import type { Genders } from "mobile/reducers";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";

type Props = {
  navigation: any,
  logoutInProgress: boolean,
  logout: () => void
};

type State = {
  useGenders: Genders,
  wantGenders: Genders
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {
    logoutInProgress: reduxState.inProgress.logout
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
      useGenders: {
        he: true,
        she: true,
        they: true
      },
      wantGenders: {
        he: true,
        she: true,
        they: true
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.logoutInProgress &&
      prevProps.logoutInProgress != this.props.logoutInProgress
    ) {
      // disable back button when performing a syncronous action.
      this.props.navigation.setParams({
        headerLeft: this.props.logoutInProgress ? null : ""
      });

      // For recieving the logout completion
      const { navigate } = this.props.navigation;
      navigate(routes.Splash, {});
    }
  }

  _onUsePronounChange = (genderIdentities: Genders) => {
    this.setState({
      useGenders: genderIdentities
    });
  };

  _onWantPronounChange = (genderIdentities: Genders) => {
    this.setState({
      wantGenders: genderIdentities
    });
  };

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: "center" }}>Gender Preferences</Text>
          <Text style={{ textAlign: "center" }}>[Statement on Gender]</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: "center" }}>{"I identify as:"}</Text>
          <GenderSelector
            defaultGenders={this.state.useGenders}
            onChange={this._onUsePronounChange}
            plural={false}
          />
          <Text style={{ textAlign: "center" }}>{"I'm looking for:"}</Text>
          <GenderSelector
            defaultGenders={this.state.wantGenders}
            onChange={this._onWantPronounChange}
            plural={true}
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
