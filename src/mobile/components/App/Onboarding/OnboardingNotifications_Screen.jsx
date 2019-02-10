// @flow
/* eslint-disable */

import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { textStyles } from 'mobile/styles/textStyles';
import type { Dispatch } from 'redux';
import type { ReduxState } from 'mobile/reducers/index';
import type { UserSettings, UserProfile, Genders } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import { OnboardingLayout } from './Onboarding_Layout';

type Props = {
  navigation: any,
};

type State = {
  profile: UserProfile,
  settings: UserSettings,
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingNotificationsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam('profile', null),
      settings: navigation.getParam('settings', null),
    };
  }

  _enableNotifications = () => {
    //TODO: enable notifications
  };

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
      onUpdateProfileSettings: (newProfile: UserProfile, newSettings: UserSettings) => {
        this.setState({
          profile: newProfile,
          settings: newSettings,
        });
      },
    });
  };

  render() {
    const body = (
      <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
        We use push notifications to let you know when you have a new match or message.
      </Text>
    );

    return (
      <OnboardingLayout
        body={body}
        section={'settings'}
        onButtonPress={this._goToNextPage}
        title="Push Notifications"
        main={true}
        progress={1}
        progressComplete={false /* TODO: toggle after completion */}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnboardingNotificationsScreen);
