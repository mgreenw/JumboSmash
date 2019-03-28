// @flow

import * as React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import AddMultiPhotos from 'mobile/components/shared/photos/AddMultiPhotos';
import { Colors } from 'mobile/styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GEMHeader from 'mobile/components/shared/Header';
import type {
  ReduxState,
  UserProfile,
  ProfileFields,
  Dispatch
} from 'mobile/reducers';
import { PrimaryInput } from 'mobile/components/shared/PrimaryInput';
import saveProfileFieldsAction from 'mobile/actions/app/saveProfile';
import NavigationService from 'mobile/components/navigation/NavigationService';
import BioInput from 'mobile/components/shared/BioInput';
import KeyboardView from 'mobile/components/shared/KeyboardView';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

const PlatformSpecificScrollView = (props: { children: React.Node }) => {
  const { children } = props;
  if (Platform.OS === 'ios') {
    return (
      <KeyboardAwareScrollView extraScrollHeight={35}>
        {children}
      </KeyboardAwareScrollView>
    );
  }
  return (
    <KeyboardView waves={false} verticalOffset={50}>
      <ScrollView>{children}</ScrollView>
    </KeyboardView>
  );
};

const styles = StyleSheet.create({
  profileBlock: {
    backgroundColor: Colors.White,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 20,
    marginBottom: 20,
    paddingBottom: 20
  }
});

type NavigationProps = {};

type ReduxProps = {
  profile: UserProfile
};

type DispatchProps = {
  saveProfileFields: (fields: ProfileFields) => void
};

type Props = ReduxProps & NavigationProps & DispatchProps;

type State = {
  editedProfileFields: ProfileFields,
  errorMessageName: string
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('Redux Client is null in Profile Edit');
  }
  return {
    profile: reduxState.client.profile
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    saveProfileFields: (fields: ProfileFields) => {
      dispatch(saveProfileFieldsAction(fields));
    }
  };
}

class ProfileEditScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editedProfileFields: props.profile.fields,
      errorMessageName: ''
    };
  }

  _onChangeBio = (bio: string) => {
    this.setState(state => ({
      editedProfileFields: {
        ...state.editedProfileFields,
        bio
      }
    }));
  };

  _onChangeName = (displayName: string) => {
    this.setState(state => ({
      editedProfileFields: {
        ...state.editedProfileFields,
        displayName
      }
    }));
  };

  // we intercept errors as notifications to user, not as a lock.
  _onBack = () => {
    const { editedProfileFields } = this.state;
    const { saveProfileFields } = this.props;
    saveProfileFields(editedProfileFields);
    NavigationService.back();
  };

  render() {
    const { width } = Dimensions.get('window');
    // A bit of a hack, but we want pictures to look nice.
    // We have 32 padding around this screen,
    // and  we want 20 padding between each
    const containerWidth = width - 64;
    const imageWidth = (containerWidth - 15) / 2;

    const { editedProfileFields, errorMessageName } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Edit Profile"
          leftIconName="back"
          onLeftIconPress={this._onBack}
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <PlatformSpecificScrollView>
            <View style={[styles.profileBlock, { marginTop: 20 }]}>
              <AddMultiPhotos width={containerWidth} imageWidth={imageWidth} />
            </View>
            <View style={styles.profileBlock}>
              <PrimaryInput
                value={editedProfileFields.displayName}
                label="Preferred Name"
                onChange={this._onChangeName}
                error={errorMessageName}
                containerStyle={{ width: '100%' }}
                assistive=""
                autoCapitalize="words"
                maxLength={20}
              />
              <View
                style={{
                  maxHeight: 210,
                  marginBottom: 30,
                  width: '100%'
                }}
              >
                <BioInput
                  value={editedProfileFields.bio}
                  onChangeText={this._onChangeBio}
                  label="About Me"
                  placeholder="Let everyone know how quirky you are"
                  maxLength={500}
                />
              </View>
            </View>
          </PlatformSpecificScrollView>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileEditScreen);
