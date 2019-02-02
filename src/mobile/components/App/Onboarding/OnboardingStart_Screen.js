// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { textStyles } from "mobile/styles/textStyles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type { UserSettings, UserProfile, Genders } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { OnboardingLayout } from "./Onboarding_Layout";
import NavigationService from "mobile/NavigationService";

type ReduxProps = {
  profile: UserProfile,
  settings: UserSettings
};

type NavigationProps = {
  navigation: any
};

type DispatchProps = {};

type Props = NavigationProps & ReduxProps & DispatchProps;

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  if (!reduxState.client) {
    throw "Error in OnboardingStart_Screen mapStateToProps: client is null";
  }
  return {
    profile: reduxState.client.profile,
    settings: reduxState.client.settings
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): DispatchProps {
  return {};
}

class OnboardingStartScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profile: props.profile,
      settings: props.settings
    };
  }

  _goToNextPage = () => {
    // const { navigation } = this.props;
    // navigation.navigate(routes.OnboardingNameAge, {
    //   profile: this.state.profile,
    //   settings: this.state.settings,
    //   onUpdateProfileSettings: (
    //     profile: UserProfile,
    //     settings: UserSettings
    //   ) => {
    //     this.setState({
    //       profile,
    //       settings
    //     });
    //   }
    // });
    NavigationService.reset();
  };

  render() {
    return (
      <OnboardingLayout
        body={
          <Text style={[textStyles.headline4Style, { textAlign: "center" }]}>
            {
              "Let's take 2 minutes to get your profile setup before you begin swiping."
            }
          </Text>
        }
        onButtonPress={this._goToNextPage}
        title="Project Gem"
        firstScreen={true}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingStartScreen);
