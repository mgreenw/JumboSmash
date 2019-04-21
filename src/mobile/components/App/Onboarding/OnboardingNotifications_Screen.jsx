// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import type { UserSettings, UserProfile } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import requestNotificationToken from 'mobile/utils/requestNotificationToken';
import { OnboardingLayout } from './Onboarding_Layout';

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

class OnboardingNotificationsScreen extends React.Component<Props, State> {
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
    navigation.navigate(routes.OnboardingFinish, {
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

  _enableNotificationsAndContinue = () => {
    const { expoPushToken } = this.state.settings;
    if (expoPushToken !== null) {
      this._goToNextPage();
    } else {
      requestNotificationToken().then(newToken => {
        if (newToken !== null) {
          this.setState(
            state => ({
              settings: {
                ...state.settings,
                expoPushToken: newToken,
                notificationsEnabled: true
              }
            }),
            () => {
              this._goToNextPage();
            }
          );
        }
      });
    }
  };

  render() {
    const { navigation } = this.props;
    const body = (
      <View style={{ flex: 1 }}>
        <Text
          style={[
            textStyles.subtitle1Style,
            { textAlign: 'center', alignSelf: 'flex-start' }
          ]}
        >
          JumboSmash uses push notifications to let you know when you have a new
          match or message.
        </Text>
      </View>
    );

    return (
      <OnboardingLayout
        navigationKey={navigation.state.key}
        body={body}
        section={'settings'}
        onButtonPress={this._enableNotificationsAndContinue}
        onSkipPress={this._goToNextPage}
        buttonText={'Enable Push Notifications'}
        title="Push Notifications"
        main
        progress={1}
      />
    );
  }
}

export default OnboardingNotificationsScreen;
