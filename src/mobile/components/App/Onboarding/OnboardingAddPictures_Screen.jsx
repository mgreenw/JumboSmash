// @flow

import React from 'react';
import { Dimensions } from 'react-native';
import type {
  UserSettings,
  UserProfile,
  ReduxState
} from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import AddMultiPhotos from 'mobile/components/shared/photos/AddMultiPhotos';
import { connect } from 'react-redux';
import { OnboardingLayout } from './Onboarding_Layout';

type NavigationProps = {
  navigation: any
};

type DispatchProps = {};

type ReduxProps = { photoUuids: string[] };

type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in Onboarding Photos');
  }
  return {
    photoUuids: reduxState.client.profile.photoUuids
  };
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

class OnboardingAddPicturesScreen extends React.Component<Props, State> {
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
    navigation.navigate(routes.OnboardingBio, {
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
    const { width } = Dimensions.get('window');
    const { photoUuids, navigation } = this.props;
    const complete = photoUuids.length > 0;

    // A bit of a hack, but we want pictures to look nice.
    // We have 10.1% padding via onboarding layout,
    // and  we want 15 padding between each
    const containerWidth = width * 0.798;
    const imageWidth = (containerWidth - 15) / 2;

    // AddMultiPhotos gets direct redux access due to constraints on
    // photo uploading. CreatMyProfile needs previously uploaded photos,
    // which occurs here.
    const body = (
      <AddMultiPhotos
        width={containerWidth}
        imageWidth={imageWidth}
        enableDeleteFirst
      />
    );

    return (
      <OnboardingLayout
        navigationKey={navigation.state.key}
        section="profile"
        body={body}
        onButtonPress={this._goToNextPage}
        title="Upload Photos"
        main
        progress={1}
        buttonDisabled={!complete}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingAddPicturesScreen);
