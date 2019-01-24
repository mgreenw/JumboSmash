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
import { GenderSelector } from "mobile/components/shared/GenderSelector";

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

class OnboardingMyPronounsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam("profile", null),
      settings: navigation.getParam("settings", null)
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state != prevState) {
      const { navigation } = this.props;
      navigation.state.params.onUpdateProfileSettings(
        this.state.profile,
        this.state.settings
      );
    }
  }

  _onMyPronounChange = (pronouns: Pronouns) => {
    this.setState((state, props) => {
      return {
        settings: {
          ...this.state.settings,
          usePronouns: pronouns
        }
      };
    });
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingWantPronouns, {
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
    const body = (
      <View style={{ flex: 1 }}>
        <Text
          style={[
            textStyles.subtitle1Style,
            { textAlign: "center", paddingBottom: 30 }
          ]}
        >
          {
            "JumboSmash uses your gender identity to determine who to show you to. It will never be shown on your profile."
          }
        </Text>
        <Text
          style={[
            textStyles.headline5Style,
            { textAlign: "center", paddingBottom: 15 }
          ]}
        >
          {"I identify as:"}
        </Text>
        <GenderSelector
          defaultPronouns={this.state.settings.usePronouns}
          onChange={this._onMyPronounChange}
          plural={false}
        />
      </View>
    );
    return (
      <OnboardingLayout
        body={body}
        onButtonPress={this._goToNextPage}
        title="Gender Identity"
        main={true}
        progress={0}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingMyPronounsScreen);
