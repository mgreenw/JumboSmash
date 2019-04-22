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
  createUserInProgress: boolean,
  createUserSuccess: ?boolean,
  isLive: boolean
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
  const { status: launchDateStatus } = reduxState.launchDate;
  return {
    createUserInProgress: reduxState.inProgress.createUser,
    createUserSuccess: reduxState.response.createUserSuccess,
    isLive: launchDateStatus !== null ? !launchDateStatus.wallIsUp : false
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
    const { navigation, createUserInProgress, createUserSuccess } = this.props;
    if (prevProps.createUserInProgress !== createUserInProgress) {
      navigation.setParams({
        headerLeft: createUserInProgress ? null : ''
      });

      if (!createUserInProgress) {
        // This only gets called because of an error that would trigger a popup error.
        // TODO: give the user a better way of fixing any errors here.
        if (createUserSuccess) {
          navigation.navigate(routes.OnboardingAppLoad, {});
        }
      }
    }
  }

  _saveSettingsAndProfile = () => {
    const { profile, settings } = this.state;
    const { createUser } = this.props;
    createUser(profile.fields, settings);
  };

  render() {
    const { isLive } = this.props;
    const { createUserInProgress, navigation } = this.props;
    const body = (
      <Text style={[textStyles.headline4Style, { textAlign: 'center' }]}>
        {"You're all set. \n\nGet in losers, we’re going smashing."}
      </Text>
    );
    return (
      <OnboardingLayout
        navigationKey={navigation.state.key}
        body={body}
        section="profile"
        onButtonPress={this._saveSettingsAndProfile}
        title="JumboSmash"
        lastScreen
        loading={createUserInProgress}
        buttonText={isLive ? 'Start Swiping' : 'Start the Countdown'}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingFinishScreen);
