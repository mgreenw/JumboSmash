// @flow
/* eslint-disable */

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { PrimaryInput } from "mobile/components/shared/PrimaryInput";
import { BirthdayInput } from "mobile/components/shared/DigitInput";
import { textStyles } from "mobile/styles/textStyles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type { UserSettings, UserProfile, Genders } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { validateBirthday } from "mobile/utils/Birthday";
import validateName from "mobile/utils/ValidateName";
import { OnboardingLayout } from "./Onboarding_Layout";

type Props = {
  navigation: any
};

type State = {
  unformatedBirthday: string,
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
    const profile = navigation.getParam("profile", null);
    const birthday = profile === null ? "" : profile.birthday;
    const unformatedBirthday = birthday ? this._unformatBirthday(birthday) : "";
    this.state = {
      unformatedBirthday,
      profile,
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
    navigation.navigate(routes.OnboardingMyGenders, {
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
    this.setState((state, props) => ({
      profile: {
        ...this.state.profile,
        displayName: name
      },
      errorMessageName: ""
    }));
  };

  _onChangeBirthday = MMDDYY => {
    const formatedBirthday = this._formatBirthday(MMDDYY);
    this.setState((state, props) => ({
      unformatedBirthday: MMDDYY,
      profile: {
        ...this.state.profile,
        birthday: formatedBirthday
      },
      errorMessageBirthday: ""
    }));
  };

  _validateInputs = () => {
    // validate birthday to be the correct
    const validBirthday = validateBirthday(this.state.profile.birthday);
    const validName = validateName(this.state.profile.displayName);
    if (!validBirthday) {
      this.setState({
        errorMessageBirthday: "Invalid Birthday"
      });
    }
    if (!validName) {
      this.setState({
        errorMessageName: "Too Long of Name"
      });
    }

    return validBirthday && validName;
  };

  _onContinue = () => {
    if (this._validateInputs()) {
      this._goToNextPage();
    }
  };

  _formatBirthday = (MMDDYY: string) => {
    if (MMDDYY.length < 6) {
      return ""; // Don't bother formating incorrect birthdays.
    }
    const decade = MMDDYY[4];
    const isTwoThousandsKid = decade === "0" || decade === "1";
    const year = `${isTwoThousandsKid ? "20" : "19"}${MMDDYY[4]}${MMDDYY[5]}`;
    const day = MMDDYY[2] + MMDDYY[3];
    const month = MMDDYY[0] + MMDDYY[1];
    return `${year}-${month}-${day}`;
  };

  _unformatBirthday = (YYYY_DD_MM: string) => {
    if (YYYY_DD_MM.length < 10) {
      return ""; // Don't bother unformatting incorrect birthdays.
    }
    const DD = YYYY_DD_MM[8] + YYYY_DD_MM[9];
    const MM = YYYY_DD_MM[5] + YYYY_DD_MM[6];
    const YY = YYYY_DD_MM[2] + YYYY_DD_MM[3];
    return `${MM}${DD}${YY}`;
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
            assistive=""
            autoCapitalize="words"
            maxLength={50}
          />
        </View>
        <View style={{ flex: 1 }}>
          <BirthdayInput
            label="Birthday"
            assistive=""
            error={this.state.errorMessageBirthday}
            value={this.state.unformatedBirthday}
            onChangeValue={this._onChangeBirthday}
            placeholder="MMDDYY"
          />
        </View>
      </View>
    );
    return (
      <OnboardingLayout
        body={body}
        onButtonPress={this._onContinue}
        title="Name & Age"
        main
        progress={0}
        buttonDisabled={
          this.state.profile.displayName == "" ||
          this.state.profile.birthday == "" ||
          this.state.errorMessageName != "" ||
          this.state.errorMessageBirthday != ""
        }
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameAgeScreen);
