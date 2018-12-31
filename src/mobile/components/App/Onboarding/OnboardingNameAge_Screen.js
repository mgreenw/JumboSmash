// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { PrimaryInput } from "mobile/components/shared/PrimaryInput";
import { BirthdayInput } from "mobile/components/shared/DigitInput";
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
  settings: UserSettings,
  errorMessageName: string,
  errorMessageBirthday: string
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class NameAgeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam("profile", null),
      settings: navigation.getParam("settings", null),
      errorMessageName: "",
      errorMessageBirthday: ""
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

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingMyPronouns, {
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

  _onChangeName = name => {
    this.setState((state, props) => {
      return {
        profile: {
          ...this.state.profile,
          displayName: name
        },
        errorMessageName: ""
      };
    });
  };

  _onChangeBirthday = birthday => {
    this.setState((state, props) => {
      return {
        profile: {
          ...this.state.profile,
          birthday: birthday
        },
        errorMessageBirthday: ""
      };
    });
  };

  _validateInputs = () => {
    let valid = true;
    // validate birthday to be the correct
    return valid;
  };

  _onContinue = () => {
    if (this._validateInputs()) {
      this._goToNextPage();
    }
  };

  render() {
    const body = (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <PrimaryInput
            value={this.state.profile.displayName}
            label="Preferred Name"
            onChange={this._onChangeName}
            error={this.state.errorMessageName}
            containerStyle={{ width: "100%" }}
            assistive={""}
            autoCapitalize={"words"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <BirthdayInput
            label={"Birthday"}
            assistive={""}
            error={this.state.errorMessageBirthday}
            value={this.state.profile.birthday}
            onChangeValue={this._onChangeBirthday}
            placeholder={"MMDDYY"}
          />
        </View>
      </View>
    );
    return (
      <OnboardingLayout
        body={body}
        onButtonPress={this._onContinue}
        title="Name & Age"
        main={true}
        progress={0}
        buttonDisabled={
          this.state.profile.displayName == "" ||
          this.state.profile.birthday == ""
        }
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameAgeScreen);
