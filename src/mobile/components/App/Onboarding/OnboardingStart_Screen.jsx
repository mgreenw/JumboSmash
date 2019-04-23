// @flow
/* eslint-disable */

import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { textStyles } from 'mobile/styles/textStyles';
import type { Dispatch } from 'mobile/reducers';
import type { ReduxState } from 'mobile/reducers/index';
import type { UserSettings, UserProfile, Genders } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import { OnboardingLayout } from './Onboarding_Layout';
import NavigationService from 'mobile/components/navigation/NavigationService';

type ReduxProps = {
  profile: UserProfile,
  settings: UserSettings
};

type NavigationProps = {
  navigation: any
};

type DispatchProps = {};

type Props = NavigationProps & ReduxProps & DispatchProps;

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  if (!reduxState.client) {
    throw 'Error in OnboardingStart_Screen mapStateToProps: client is null';
  }
  return {
    profile: reduxState.client.profile,
    settings: reduxState.client.settings
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): DispatchProps {
  return {};
}

class OnboardingStartScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profile: props.profile,
      settings: props.settings
    };
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    const { profile, settings } = this.state;
    navigation.navigate(routes.OnboardingTermsAndConditions, {
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
    const { navigation } = this.props;
    return (
      <OnboardingLayout
        navigationKey={navigation.state.key}
        body={
          <Text style={[textStyles.headline4Style, { textAlign: 'center' }]}>
            {"Let's get your profile setup before you begin swiping."}
          </Text>
        }
        section={'profile'}
        onButtonPress={this._goToNextPage}
        title="JumboSmash"
        firstScreen={true}
        buttonText={"Roll 'Bos"}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingStartScreen);
