// @flow

import * as React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import AddMultiPhotos from 'mobile/components/shared/photos/AddMultiPhotos';
import { Colors } from 'mobile/styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GEMHeader from 'mobile/components/shared/Header';
import type {
  NavigationEventPayload,
  NavigationScreenProp,
  NavigationEventSubscription
} from 'react-navigation';
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
import { validateName, nameErrorCopy } from 'mobile/utils/ValidateName';
import TertiaryButton from 'mobile/components/shared/buttons/TertiaryButton';
import { textStyles } from 'mobile/styles/textStyles';
import Spacer from 'mobile/components/shared/Spacer';
import routes from 'mobile/components/navigation/routes';
import { codeToLocation as postgradCodeToLocation } from 'mobile/data/Locations';
import { codeToName as dormCodeToName } from 'mobile/data/Dorms/';
import type { Artist } from 'mobile/reducers/artists';

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

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

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
    this.willBlurListener = props.navigation.addListener(
      'willBlur',
      this._onWillBlur
    );
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
    const { navigation } = this.props;
    const valid = this._validateInputs();
    if (valid) {
      NavigationService.back(navigation.state.key);
    }
  };

  _validateInputs = () => {
    // validate birthday to be the correct
    const { editedProfileFields } = this.state;
    const { valid: nameValid, reason: nameValidReason } = validateName(
      editedProfileFields.displayName
    );
    if (!nameValid) {
      this.setState({
        errorMessageName: nameErrorCopy(nameValidReason)
      });
    }

    return nameValid;
  };

  /**
   * Save the profile.
   * We do this on onWillBlur to check if this occured from either a back press OR a backswipe.
   * If the blur is to a forward screen (e.g. city select), do NOT save.
   */
  _onWillBlur = (payload: NavigationEventPayload) => {
    if (payload.action.type === 'Navigation/BACK') {
      const { editedProfileFields } = this.state;
      const { saveProfileFields } = this.props;
      saveProfileFields(editedProfileFields);
      this.willBlurListener.remove();
    }
  };

  willBlurListener: NavigationEventSubscription;

  render() {
    const { width } = Dimensions.get('window');
    // A bit of a hack, but we want pictures to look nice.
    // We have 32 padding around this screen,
    // and  we want 20 padding between each
    const containerWidth = width - 64;
    const imageWidth = (containerWidth - 15) / 2;

    const { editedProfileFields, errorMessageName } = this.state;
    const { postgradRegion: postgradLocationCode } = editedProfileFields;
    const { freshmanDorm: freshmanDormCode } = editedProfileFields;
    const { springFlingActArtist } = editedProfileFields;
    const freshmanDorm = freshmanDormCode
      ? dormCodeToName(freshmanDormCode)
      : null;
    const postgradLocation = postgradLocationCode
      ? postgradCodeToLocation(postgradLocationCode)
      : null;
    const postgradLocationName = postgradLocation
      ? postgradLocation.name
      : null;
    const artistName = springFlingActArtist ? springFlingActArtist.name : null;

    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Edit Profile"
          leftIcon={{ name: 'back', onPress: this._onBack }}
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
                label="Preferred First Name"
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
            <View style={styles.profileBlock}>
              <PopupInput
                title={'Post-Grad Location'}
                value={postgradLocationName}
                placeholder={'Add Location'}
                onChange={() => {
                  NavigationService.navigate(routes.SelectCity, {
                    onSave: newPostgradRegion => {
                      this.setState(state => ({
                        editedProfileFields: {
                          ...state.editedProfileFields,
                          postgradRegion: newPostgradRegion
                        }
                      }));
                    }
                  });
                }}
              />
              <Spacer style={{ marginTop: 16, marginBottom: 8 }} />
              <PopupInput
                title={'First Year Dorm'}
                value={freshmanDorm}
                placeholder={'Add Dorm'}
                onChange={() => {
                  NavigationService.navigate(routes.SelectDorm, {
                    onSave: newFreshmanDorm => {
                      this.setState(state => ({
                        editedProfileFields: {
                          ...state.editedProfileFields,
                          freshmanDorm: newFreshmanDorm
                        }
                      }));
                    }
                  });
                }}
              />
              <Spacer style={{ marginTop: 16, marginBottom: 8 }} />
              <PopupInput
                title={'Dream Spring Fling Artist'}
                value={artistName}
                placeholder={'Add Artist'}
                onChange={() => {
                  NavigationService.navigate(routes.SelectArtist, {
                    onSave: (id: null | string, artist: null | Artist) => {
                      this.setState(state => ({
                        editedProfileFields: {
                          ...state.editedProfileFields,
                          springFlingAct: id,
                          springFlingActArtist: artist
                        }
                      }));
                    }
                  });
                }}
              />
            </View>
          </PlatformSpecificScrollView>
        </View>
      </View>
    );
  }
}

type PopupInputProps = {
  title: string,
  value: ?string,
  placeholder: string,
  onChange: () => void
};
const PopupInput = (props: PopupInputProps) => {
  const { title, placeholder, onChange, value } = props;
  return (
    <TouchableOpacity onPress={onChange}>
      <View>
        <Text style={textStyles.body2Style}>{title}</Text>
        <View
          onPress={onChange}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 5
          }}
        >
          <Text
            adjustsFontSizeToFit
            style={[
              textStyles.headline6Style,
              { color: value ? Colors.Black : Colors.BlueyGrey }
            ]}
          >
            {value || placeholder}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileEditScreen);
