// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { textStyles } from 'mobile/styles/textStyles';
import type { Dispatch } from 'redux';
import type { ReduxState, PhotoIds } from 'mobile/reducers/index';
import type { UserSettings, UserProfile, Genders } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import AddMultiPhotos from 'mobile/components/shared/photos/AddMultiPhotos';
import { OnboardingLayout } from './Onboarding_Layout';

type NavigationProps = {
  navigation: any,
};

type ReduxProps = {
  photoIds: PhotoIds,
};

type DispatchProps = {};

type Props = NavigationProps & ReduxProps & DispatchProps;

type State = {
  profile: UserProfile,
  settings: UserSettings,
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  if (!reduxState.client) {
    throw 'Error: client is null in onboarding add photos';
  }
  return {
    photoIds: reduxState.client.profile.photoIds,
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props): DispatchProps {
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
    if (this.state != prevState) {
      const { navigation } = this.props;
      navigation.state.params.onUpdateProfileSettings(this.state.profile, this.state.settings);
    }
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingBio, {
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
    const { height, width } = Dimensions.get('window');
    // A bit of a hack, but we want pictures to look nice.
    // We have 22 padding via onboarding layout, plus an additional 40 here,
    // and  we want 20 padding between each
    const containerWidth = width - 44 - 80;
    const imageWidth = (containerWidth - 15) / 2;

    return (
      <OnboardingLayout
        body={
          // AddMultiPhotos gets direct redux access due to constraints on
          // photo uploading. CreatMyProfile needs previously uploaded photos,
          // which occurs here.
          <AddMultiPhotos width={containerWidth} imageWidth={imageWidth} enableDeleteFirst />
        }
        onButtonPress={this._goToNextPage}
        title="Upload Photos"
        main
        progress={3}
        buttonDisabled={this.props.photoIds.length === 0}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnboardingAddPicturesScreen);
