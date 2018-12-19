// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { textStyles } from "mobile/styles/textStyles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type {
  UserSettings,
  UserProfile,
  Pronouns
} from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { OnboardingLayout } from "./Onboarding_Layout";
import { createUser } from "mobile/actions/app/createUser";

type Props = {
  navigation: any,
  token: string,
  createUser: (
    token: string,
    profile: UserProfile,
    settings: UserSettings
  ) => void,
  createUserInProgress: boolean
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {
    token: reduxState.token,
    createUserInProgress: reduxState.inProgress.createUser
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {
    createUser: (
      token: string,
      profile: UserProfile,
      settings: UserSettings
    ) => {
      dispatch(createUser(token, profile, settings));
    }
  };
}

class OnboardingFinishScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam("profile", null),
      settings: navigation.getParam("settings", null)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.createUserInProgress != this.props.createUserInProgress) {
      this.props.navigation.setParams({
        headerLeft: this.props.createUserInProgress ? null : ""
      });

      // todo: watch for errors
      if (!this.props.createUserInProgress) {
        const { navigate } = this.props.navigation;
        navigate(routes.OnboardingAppLoad, {});
      }
    }
  }

  // IMPORTANT: must be like this in order for back button toggling!
  static navigationOptions = ({ navigation }) => ({
    headerLeft: navigation.state.params.headerLeft,
    title: "Verification",
    headerStyle: {
      borderBottomWidth: 0
    }
  });

  _saveSettingsAndProfile = () => {
    this.props.createUser(
      this.props.token,
      this.state.profile,
      this.state.settings
    );
  };

  render() {
    return (
      <OnboardingLayout
        body={
          <Text style={[textStyles.headline4Style, { textAlign: "center" }]}>
            {"Your profile’s ready. Get in losers, we’re going smashing."}
          </Text>
        }
        onButtonPress={this._saveSettingsAndProfile}
        title="Project Gem"
        last={true}
        loading={this.props.createUserInProgress}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingFinishScreen);
