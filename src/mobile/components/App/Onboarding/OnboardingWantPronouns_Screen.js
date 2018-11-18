// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { PronounSelector } from "mobile/components/shared/PronounSelector";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import type {
  UserSettings,
  UserProfile,
  Pronouns
} from "mobile/reducers/index";

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

class OnboardingWantPronounsScreen extends React.Component<Props, State> {
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
          wantPronouns: pronouns
        }
      };
    });
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate("OnboardingAddPictures", {
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
      <View style={Arthur_Styles.container}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.onboardingHeader}>
            Pronoun Preferences
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>
            We use pronouns to help determine who to show in your stack in
            Project GEM. Your pronouns will not be shown on your profile.
          </Text>
          <Text>{"I'm looking for:"}</Text>
          <PronounSelector
            defaultPronouns={this.state.settings.wantPronouns}
            onChange={this._onMyPronounChange}
          />
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={this._goToNextPage} title="Continue" />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingWantPronounsScreen);
