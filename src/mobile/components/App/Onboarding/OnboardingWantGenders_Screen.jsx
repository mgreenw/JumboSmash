// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import type { UserSettings, UserProfile, Genders } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import { GenderSelector } from 'mobile/components/shared/GenderSelector';
import { OnboardingLayout } from './Onboarding_Layout';

type Props = {
  navigation: any,
};

type State = {
  profile: UserProfile,
  settings: UserSettings,
};

export default class OnboardingWantGendersScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam('profile', null),
      settings: navigation.getParam('settings', null),
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state !== prevState) {
      const { navigation } = this.props;
      const { profile, settings } = this.state;
      navigation.state.params.onUpdateProfileSettings(profile, settings);
    }
  }

  _onMyPronounChange = (genderIdentities: Genders) => {
    this.setState(state => ({
      settings: {
        ...state.settings,
        wantGenders: genderIdentities,
      },
    }));
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    const { profile, settings } = this.state;
    navigation.navigate(routes.OnboardingAddPictures, {
      profile,
      settings,
      onUpdateProfileSettings: (newProfile: UserProfile, newSettings: UserSettings) => {
        this.setState({
          profile: newProfile,
          settings: newSettings,
        });
      },
    });
  };

  render() {
    const { settings } = this.state;
    const body = (
      <View style={{ flex: 1, width: '100%' }}>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center', paddingBottom: 30 }]}>
          {
            'JumboSmash uses your gender preferences to determine who to show to you. They will never be shown on your profile.'
          }
        </Text>
        <Text style={[textStyles.headline5Style, { textAlign: 'center', paddingBottom: 15 }]}>
          {"I'm looking for:"}
        </Text>
        <GenderSelector
          defaultGenders={settings.wantGenders}
          onChange={this._onMyPronounChange}
          plural
        />
      </View>
    );
    return (
      <OnboardingLayout
        body={body}
        onButtonPress={this._goToNextPage}
        title="Pronoun Preferences"
        main
        progress={0}
      />
    );
  }
}