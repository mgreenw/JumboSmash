// @flow
import React from 'react';
import { View } from 'react-native';
import type { UserSettings, UserProfile } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import BioInput from 'mobile/components/shared/BioInput';
import { OnboardingLayout } from './Onboarding_Layout';

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

export default class OnboardingBioScreen extends React.Component<Props, State> {
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

  _onBioUpdate = (bio: string) => {
    this.setState(state => ({
      profile: {
        ...state.profile,
        fields: {
          ...state.profile.fields,
          bio
        }
      }
    }));
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    const { profile, settings } = this.state;
    navigation.navigate(routes.OnboardingSettingsInfo, {
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
    const { profile } = this.state;
    const { navigation } = this.props;
    const complete = profile.fields.bio !== '';
    const body = (
      <View
        style={{
          maxHeight: 210,
          marginBottom: 30,
          width: '100%'
        }}
      >
        <BioInput
          placeholder="The real Tony Monaco"
          onChangeText={this._onBioUpdate}
          value={profile.fields.bio}
          maxLength={500}
        />
      </View>
    );

    return (
      <OnboardingLayout
        navigationKey={navigation.state.key}
        section="profile"
        body={body}
        onButtonPress={this._goToNextPage}
        title="About Me"
        main
        progress={2}
        buttonDisabled={!complete}
      />
    );
  }
}
