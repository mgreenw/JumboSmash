// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { textStyles } from 'mobile/styles/textStyles';
import type { Dispatch } from 'redux';
import type { ReduxState } from 'mobile/reducers/index';
import type { UserSettings, UserProfile, Genders } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import GEMHeader from 'mobile/components/shared/Header';
import { Transition } from 'react-navigation-fluid-transitions';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { OnboardingLayout } from './Onboarding_Layout';
import TermsAndConditions from 'mobile/assets/copy/termsAndConditions';

type Props = {
  navigation: any,
};

type State = {
  profile: UserProfile,
  settings: UserSettings,
};

export default class OnboardingTermsAndConditionsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam('profile', null),
      settings: navigation.getParam('settings', null),
    };
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingNameAge, {
      profile: this.state.profile,
      settings: this.state.settings,
      onUpdateProfileSettings: (profile: UserProfile, settings: UserSettings) => {
        this.setState({
          profile,
          settings,
        });
      },
    });
  };

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader leftIconName="back" title="Terms & Conditions" loading={false} />
        <Transition inline appear="horizontal">
          <View style={{ flex: 1 }}>
            <ScrollView>
              <View style={{ paddingLeft: 38, paddingRight: 38 }}>
                <TermsAndConditions />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 35,
                  paddingBottom: 35,
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
