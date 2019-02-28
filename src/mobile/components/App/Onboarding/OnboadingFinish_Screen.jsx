// @flow
import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { textStyles } from 'mobile/styles/textStyles';
import type {
  UserSettings,
  UserProfile,
  ReduxState,
  ProfileFields,
  Dispatch
} from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import createUserAction from 'mobile/actions/app/createUser';
import { OnboardingLayout } from './Onboarding_Layout';

type NavigationProps = {
  navigation: any
};

type ReduxProps = {
  createUserInProgress: boolean
};
type DispatchProps = {
  createUser: (fields: ProfileFields, settings: UserSettings) => void
};
type Props = NavigationProps & ReduxProps & DispatchProps;

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    createUserInProgress: reduxState.inProgress.createUser
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    createUser: (fields: ProfileFields, settings: UserSettings) => {
      dispatch(createUserAction(fields, settings));
    }
  };
}

class OnboardingFinishScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam('profile', null),
      settings: navigation.getParam('settings', null)
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { navigation, createUserInProgress } = this.props;
    if (prevProps.createUserInProgress !== createUserInProgress) {
      navigation.setParams({
        headerLeft: createUserInProgress ? null : ''
      });

      // todo: watch for errors
      if (!createUserInProgress) {
        navigation.navigate(routes.OnboardingAppLoad, {});
      }
    }
  }

  _saveSettingsAndProfile = () => {
    const { profile, settings } = this.state;
    const { createUser } = this.props;
    createUser(profile.fields, settings);
  };

  render() {
    const { createUserInProgress } = this.props;
    return (
      <OnboardingLayout
        body={
          <Text style={[textStyles.headline4Style, { textAlign: 'center' }]}>
            {'Your profile’s ready. \n\nGet in losers, we’re going smashing.'}
          </Text>
        }
        section="profile"
        onButtonPress={this._saveSettingsAndProfile}
        title="Project Gem"
        lastScreen
        loading={createUserInProgress}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingFinishScreen);
