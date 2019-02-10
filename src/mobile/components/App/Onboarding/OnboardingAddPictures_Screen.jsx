// @flow

import React from 'react';
import { Dimensions } from 'react-native';
import type { UserSettings, UserProfile, ReduxState } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import AddMultiPhotos from 'mobile/components/shared/photos/AddMultiPhotos';
import { connect } from 'react-redux';
import { OnboardingLayout } from './Onboarding_Layout';

type NavigationProps = {
  navigation: any,
};

type DispatchProps = {};

type ReduxProps = { photoIds: number[] };

type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {
  profile: UserProfile,
  settings: UserSettings,
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in Onboarding Photos');
  }
  return {
    photoIds: reduxState.client.profile.photoIds,
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
      settings: navigation.getParam('settings', null),
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
      onUpdateProfileSettings: (newProfile: UserProfile, newSettings: UserSettings) => {
        this.setState({
          profile: newProfile,
          settings: newSettings,
        });
      },
    });
  };

  render() {
    const { width } = Dimensions.get('window');
    const { photoIds } = this.props;
    const complete = photoIds.length > 0;

    // A bit of a hack, but we want pictures to look nice.
    // We have 22 padding via onboarding layout, plus an additional 40 here,
    // and  we want 20 padding between each
    const containerWidth = width - 44 - 80;
    const imageWidth = (containerWidth - 15) / 2;

    return (
      <OnboardingLayout
        section="profile"
        body={
          // AddMultiPhotos gets direct redux access due to constraints on
          // photo uploading. CreatMyProfile needs previously uploaded photos,
          // which occurs here.
          <AddMultiPhotos width={containerWidth} imageWidth={imageWidth} enableDeleteFirst />
        }
        onButtonPress={this._goToNextPage}
        title="Upload Photos"
        main
        progress={1}
        progressComplete={complete}
        buttonDisabled={!complete}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnboardingAddPicturesScreen);
