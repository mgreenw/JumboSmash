// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { textStyles } from 'mobile/styles/textStyles';
import type { Dispatch } from 'mobile/reducers';
import type { ReduxState } from 'mobile/reducers/index';
import type { UserSettings, UserProfile, Genders } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import GEMHeader from 'mobile/components/shared/Header';
import { Transition } from 'react-navigation-fluid-transitions';
import { PrimaryButton } from 'mobile/components/shared/buttons';
import { OnboardingLayout } from './Onboarding_Layout';
import TermsAndConditions from 'mobile/assets/copy/termsAndConditions';
import NavigationService from 'mobile/components/navigation/NavigationService';

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

export default class OnboardingTermsAndConditionsScreen extends React.Component<
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
    navigation.navigate(routes.OnboardingNameAge, {
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

  _onBack = () => {
    const { navigation } = this.props;
    NavigationService.back(navigation.state.key);
  };

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader
          leftIcon={{ name: 'back', onPress: this._onBack }}
          title="Terms & Conditions"
          loading={false}
        />
        <Transition inline appear="horizontal">
          <View style={{ flex: 1 }}>
            <ScrollView>
              <View style={{ paddingHorizontal: '10%' }}>
                <TermsAndConditions />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 35,
                  paddingBottom: 70
                }}
              >
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    onPress={this._goToNextPage}
                    title="Accept"
                    loading={false}
                    disabled={false}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </ScrollView>
          </View>
        </Transition>
      </View>
    );
  }
}
