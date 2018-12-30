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

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingStartScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    let propsProfile: ?UserProfile = navigation.getParam("profile", null);
    let propsSettings: ?UserSettings = navigation.getParam("settings", null);
    this.state = {
      profile: propsProfile || {
        bio: "foo",
        birthday: "1997-06-26",
        displayName: "",
        images: []
      },
      settings: propsSettings || {
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
      }
    };
  }

  static navigationOptions = {
    headerLeft: null
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingNameAge, {
      profile: this.state.profile,
      settings: this.state.settings,
      onUpdateProfileSettings: (
        profile: UserProfile,
        settings: UserSettings
      ) => {
        this.setState({
          profile,
          settings
        });
      }
    });
  };

  render() {
    return (
      <OnboardingLayout
        body={
          <Text style={[textStyles.headline4Style, { textAlign: "center" }]}>
            {
              "Let's take 2 minutes to get your profile setup before you begin swiping"
            }
          </Text>
        }
        onButtonPress={this._goToNextPage}
        title="Project Gem"
        first={true}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingStartScreen);
