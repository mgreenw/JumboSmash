// @flow
/* eslint-disable */

import React from 'react';
import { Dimensions, View, StyleSheet, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Input } from 'react-native-elements';
import type { Dispatch } from 'redux';
import AddMultiPhotos from 'mobile/components/shared/photos/AddMultiPhotos';
import { Colors } from 'mobile/styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GEMHeader from 'mobile/components/shared/Header';
import type { ReduxState, UserProfile } from 'mobile/reducers';
import { PrimaryInput } from 'mobile/components/shared/PrimaryInput';
import { saveProfile } from 'mobile/actions/app/saveProfile';
import NavigationService from 'mobile/NavigationService';
import BioInput from 'mobile/components/shared/BioInput';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

const styles = StyleSheet.create({
  profileBlock: {
    backgroundColor: Colors.White,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 20,
    marginBottom: 20,
    paddingBottom: 20,
  },
});

type navigationProps = {
  navigation: any,
};

type reduxProps = {
  profile: UserProfile,
};

type dispatchProps = {
  saveProfile: (profile: UserProfile) => void,
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
  editedProfile: UserProfile,
  errorMessageName: string,
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  if (!reduxState.client) {
    throw new Error('Redux Client is null in Profile Edit');
  }
  return {
    profile: reduxState.client.profile,
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props): dispatchProps {
  return {
    saveProfile: (profile: UserProfile) => {
      dispatch(saveProfile(profile));
    },
  };
}

class ProfileEditScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editedProfile: props.profile,
      errorMessageName: '',
    };
  }

  _onChangeBio = (bio: string) => {
    this.setState(prevState => ({
      editedProfile: {
        ...prevState.editedProfile,
        bio,
      },
    }));
  };

  _onChangeName = (displayName: string) => {
    this.setState(prevState => ({
      editedProfile: {
        ...prevState.editedProfile,
        displayName,
      },
    }));
  };

  // we intercept errors as notifications to user, not as a lock.
  _onBack = () => {
    const { editedProfile } = this.state;
    this.props.saveProfile(editedProfile);
    NavigationService.back();
  };

  // for refs
  nameInput: Input;

  bioInput: Input;

  render() {
    const { width } = Dimensions.get('window');
    // A bit of a hack, but we want pictures to look nice.
    // We have 32 padding around this screen,
    // and  we want 20 padding between each
    const containerWidth = width - 64;
    const imageWidth = (containerWidth - 15) / 2;

    const { editedProfile, errorMessageName } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader title="Edit Profile" leftIconName="back" onLeftIconPress={this._onBack} />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <KeyboardAwareScrollView extraScrollHeight={35}>
            <View style={[styles.profileBlock, { marginTop: 20 }]}>
              <AddMultiPhotos
                images={editedProfile.photoIds}
                width={containerWidth}
                imageWidth={imageWidth}
              />
            </View>
            <View style={styles.profileBlock}>
              <PrimaryInput
                value={editedProfile.displayName}
                label="Preferred Name"
                onChange={this._onChangeName}
                error={errorMessageName}
                containerStyle={{ width: '100%' }}
                assistive=""
                autoCapitalize="words"
              />
              <View
                style={{
                  maxHeight: 210,
                  marginBottom: 30,
                  width: '100%',
                }}
              >
                <BioInput
                  value={editedProfile.bio}
                  onChangeText={this._onChangeBio}
                  label="About Me"
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileEditScreen);
