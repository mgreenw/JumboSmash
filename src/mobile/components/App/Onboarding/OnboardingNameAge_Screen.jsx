// @flow

import React from 'react';
import { View } from 'react-native';
import { PrimaryInput } from 'mobile/components/shared/PrimaryInput';
import { BirthdayInput } from 'mobile/components/shared/DigitInput';
import type { UserSettings, UserProfile } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { validateBirthday, birthdayErrorCopy } from 'mobile/utils/Birthday';
import { validateName, nameErrorCopy } from 'mobile/utils/ValidateName';
import { OnboardingLayout } from './Onboarding_Layout';

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

export default class NameAgeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    const profile = navigation.getParam('profile', null);
    const birthday = profile === null ? '' : profile.fields.birthday;
    const unformatedBirthday = birthday ? this._unformatBirthday(birthday) : '';
    this.state = {
      unformatedBirthday,
      profile,
      settings: navigation.getParam('settings', null),
      errorMessageName: '',
      errorMessageBirthday: ''
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state !== prevState) {
      const { profile, settings } = this.state;
      const { navigation } = this.props;
      navigation.state.params.onUpdateProfileSettings(profile, settings);
    }
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    const { profile, settings } = this.state;
    navigation.navigate(routes.OnboardingAddPictures, {
      profile,
      settings,
      onUpdateProfileSettings: (
        newProfile: UserProfile,
        newSettings: UserSettings
      ) => {
        this.setState({
          profile: newProfile,
          settings: newSettings
        });
      }
    });
  };

  _onChangeName = (name: string) => {
    this.setState(state => ({
      profile: {
        ...state.profile,
        fields: {
          ...state.profile.fields,
          displayName: name
        }
      },
      errorMessageName: ''
    }));
  };

  _onChangeBirthday = (MMDDYY: string) => {
    const formatedBirthday = this._formatBirthday(MMDDYY);
    this.setState(state => ({
      unformatedBirthday: MMDDYY,
      profile: {
        ...state.profile,
        fields: {
          ...state.profile.fields,
          birthday: formatedBirthday
        }
      },
      errorMessageBirthday: ''
    }));
  };

  _validateInputs = () => {
    // validate birthday to be the correct
    const { profile } = this.state;
    const {
      valid: validBirthday,
      reason: validBirthdayReason
    } = validateBirthday(profile.fields.birthday);
    const { valid: validName, reason: validNameReason } = validateName(
      profile.fields.displayName
    );
    if (!validBirthday) {
      this.setState({
        errorMessageBirthday: birthdayErrorCopy(validBirthdayReason)
      });
    }
    if (!validName) {
      this.setState({
        errorMessageName: nameErrorCopy(validNameReason)
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
      return ''; // Don't bother formating incorrect birthdays.
    }
    const decade = MMDDYY[4];
    const isTwoThousandsKid = decade === '0' || decade === '1';
    const year = `${isTwoThousandsKid ? '20' : '19'}${MMDDYY[4]}${MMDDYY[5]}`;
    const day = MMDDYY[2] + MMDDYY[3];
    const month = MMDDYY[0] + MMDDYY[1];
    return `${year}-${month}-${day}`;
  };

  _unformatBirthday = (YYYY_DD_MM: string) => {
    if (YYYY_DD_MM.length < 10) {
      return ''; // Don't bother unformatting incorrect birthdays.
    }
    const DD = YYYY_DD_MM[8] + YYYY_DD_MM[9];
    const MM = YYYY_DD_MM[5] + YYYY_DD_MM[6];
    const YY = YYYY_DD_MM[2] + YYYY_DD_MM[3];
    return `${MM}${DD}${YY}`;
  };

  render() {
    const { navigation } = this.props;
    const {
      profile,
      errorMessageName,
      errorMessageBirthday,
      unformatedBirthday
    } = this.state;
    const incomplete =
      profile.fields.displayName === '' ||
      profile.fields.birthday === '' ||
      errorMessageName !== '' ||
      errorMessageBirthday !== '';
    const body = (
      <View
        style={{
          flex: 1
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <PrimaryInput
            value={profile.fields.displayName}
            label="Preferred First Name"
            onChange={this._onChangeName}
            error={errorMessageName}
            containerStyle={{ width: '100%' }}
            assistive=""
            autoCapitalize="words"
            maxLength={20}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <BirthdayInput
            label="Birthday"
            assistive=""
            error={errorMessageBirthday}
            value={unformatedBirthday}
            onChangeValue={this._onChangeBirthday}
            placeholder="MMDDYY"
          />
        </View>
      </View>
    );
    return (
      <OnboardingLayout
        navigationKey={navigation.state.key}
        section="profile"
        body={body}
        onButtonPress={this._onContinue}
        title="Name & Age"
        main
        progress={0}
        buttonDisabled={incomplete}
      />
    );
  }
}
