// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import type { UserSettings, UserProfile } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { Colors } from 'mobile/styles/colors';
import { WebBrowser } from 'expo';
import { OnboardingLayout } from './Onboarding_Layout';

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

export default class OnboardingSettingsInfoScreen extends React.Component<
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

  _goToNextPage = () => {
    const { navigation } = this.props;
    const { profile, settings } = this.state;
    navigation.navigate(routes.OnboardingGenders, {
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
    const body = (
      <View style={{ flex: 1, width: '100%' }}>
        <Text style={textStyles.body1Style}>
          {
            'The next few questions will help us match you with the right people. We understand that gender identity is a spectrum, and believe that the way you identify should be left up to you, so please interpret the following gender options however they make sense to you. For more information, check out our '
          }
          <Text
            style={{
              color: Colors.Grapefruit,
              textDecorationLine: 'underline'
            }}
            onPress={() => {
              // TODO: Make this go to the jumbosmash.com
              WebBrowser.openBrowserAsync(
                'https://arthur.jumbosmash.com/gender.html'
              );
            }}
          >
            {'Statement on Gender'}
          </Text>
          .
        </Text>
        <Text style={textStyles.headline6Style}>
          {'\nNone of the following information will be shown on your profile.'}
        </Text>
      </View>
    );
    return (
      <OnboardingLayout
        body={body}
        infoScreen
        section="settings"
        onButtonPress={this._goToNextPage}
        title="JumboSmash"
      />
    );
  }
}
