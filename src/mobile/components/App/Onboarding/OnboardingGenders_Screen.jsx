// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import type { UserSettings, UserProfile, Genders } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { GenderSelector } from 'mobile/components/shared/GenderSelector';
import { OnboardingLayout } from './Onboarding_Layout';

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

export default class OnboardingGendersScreen extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam('profile', null),
      settings: navigation.getParam('settings', null)
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state !== prevState) {
      const { navigation } = this.props;
      const { profile, settings } = this.state;
      navigation.state.params.onUpdateProfileSettings(profile, settings);
    }
  }

  _onMyGendersChange = (genderIdentities: Genders) => {
    this.setState(state => ({
      settings: {
        ...state.settings,
        identifyAsGenders: genderIdentities
      }
    }));
  };

  _onWantGendersChange = (genderIdentities: Genders) => {
    this.setState(state => ({
      settings: {
        ...state.settings,
        lookingForGenders: genderIdentities
      }
    }));
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    const { profile, settings } = this.state;
    navigation.navigate(routes.OnboardingNotifications, {
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

  render() {
    const { settings } = this.state;
    const body = (
      <View style={{ flex: 1, width: '110%' }}>
        <Text
          style={[
            textStyles.headline5Style,
            { textAlign: 'center', paddingBottom: 15 }
          ]}
        >
          {'I identify as:'}
        </Text>
        <GenderSelector
          defaultGenders={settings.identifyAsGenders}
          onChange={this._onMyGendersChange}
          plural={false}
        />
        <Text
          style={[
            textStyles.headline5Style,
            { textAlign: 'center', paddingBottom: 15, paddingTop: 25 }
          ]}
        >
          {"I'm looking for:"}
        </Text>
        <GenderSelector
          defaultGenders={settings.lookingForGenders}
          onChange={this._onWantGendersChange}
          plural
        />
      </View>
    );

    const { lookingForGenders, identifyAsGenders } = settings;
    const lookingForSelected =
      lookingForGenders.man ||
      lookingForGenders.woman ||
      lookingForGenders.nonBinary;
    const identifySelected =
      identifyAsGenders.man ||
      identifyAsGenders.woman ||
      identifyAsGenders.nonBinary;
    const complete = identifySelected && lookingForSelected;
    return (
      <OnboardingLayout
        body={body}
        section="settings"
        onButtonPress={this._goToNextPage}
        title="Gender Identity"
        main
        progress={0}
        buttonDisabled={!complete}
      />
    );
  }
}
