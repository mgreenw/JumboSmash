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
  Genders
} from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { OnboardingLayout } from "./Onboarding_Layout";
import BioInput from "mobile/components/shared/BioInput";

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

class OnboardingBioScreen extends React.Component<Props, State> {
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

  _onBioUpdate = (bio: string) => {
    this.setState((state, props) => {
      return {
        profile: {
          ...this.state.profile,
          bio: bio
        }
      };
    });
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingNotifications, {
      profile: this.state.profile,
      settings: this.state.settings
    });
  };

  render() {
    const body = (
      <View
        style={{
          maxHeight: 210,
          marginBottom: 30,
          width: "100%"
        }}
      >
        <BioInput
          placeholder="The real Tony Monaco"
          onChangeText={this._onBioUpdate}
          value={this.state.profile.bio}
        />
      </View>
    );

    return (
      <OnboardingLayout
        body={body}
        onButtonPress={this._goToNextPage}
        title="About Me"
        main={true}
        progress={0}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingBioScreen);
