// @flow
import React from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { Button, Icon, Input } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import AddPhotos from "mobile/components/shared/AddPhotos";
import { Colors } from "mobile/styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GEMHeader from "mobile/components/shared/Header";
import type { UserProfile } from "mobile/reducers";
import { PrimaryInput } from "mobile/components/shared/PrimaryInput";
import { saveProfile } from "mobile/actions/app/saveProfile";
import NavigationService from "mobile/NavigationService";
import BioInput from "mobile/components/shared/BioInput";

type navigationProps = {
  navigation: any
};

type reduxProps = {
  token: string,
  profile: UserProfile,
  saveProfileInProgress: boolean
};

type dispatchProps = {
  saveProfile: (token: string, profile: UserProfile) => void
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
  editedProfile: UserProfile,
  errorMessageName: string,
  scrollEnabled: boolean
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  if (!reduxState.user) {
    throw "Redux User is null";
  }
  if (!reduxState.token) {
    throw "Token is null";
  }
  return {
    token: reduxState.token,
    profile: reduxState.user.profile,
    saveProfileInProgress: reduxState.inProgress.saveProfile
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): dispatchProps {
  return {
    saveProfile: (token: string, profile: UserProfile) => {
      dispatch(saveProfile(token, profile));
    }
  };
}

class ProfileEditScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editedProfile: props.profile,
      errorMessageName: "",
      scrollEnabled: false
    };
  }

  // for refs
  nameInput: Input;
  bioInput: Input;

  _onChangeBio = (bio: string) => {
    this.setState((prevState, prevProps) => {
      return {
        editedProfile: {
          ...prevState.editedProfile,
          bio
        }
      };
    });
  };

  _onChangeName = (displayName: string) => {
    this.setState((prevState, prevProps) => {
      return {
        editedProfile: {
          ...prevState.editedProfile,
          displayName
        }
      };
    });
  };

  // we intercept errors as notifications to user, not as a lock.
  _onBack = () => {
    this.props.saveProfile(this.props.token, this.state.editedProfile);
    NavigationService.back();
  };

  render() {
    const { height, width } = Dimensions.get("window");
    // A bit of a hack, but we want pictures to look nice.
    // We have 32 padding around this screen,
    // and  we want 20 padding between each
    const containerWidth = width - 64;
    const imageWidth = (containerWidth - 15) / 2;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Edit Profile"
          leftIconName={"back"}
          onLeftIconPress={this._onBack}
        />
        <KeyboardAwareScrollView
          extraScrollHeight={30}
          style={{
            backgroundColor: Colors.AquaMarine,
            paddingTop: 20
          }}
        >
          <View style={styles.profileBlock}>
            <AddPhotos
              images={this.state.editedProfile.images}
              width={containerWidth}
              imageWidth={imageWidth}
              onChangeImages={images => {
                this.setState(prevState => {
                  return {
                    editedProfile: {
                      ...prevState.editedProfile,
                      images
                    }
                  };
                });
              }}
              onRemove={index => {
                this.setState(prevState => {
                  const newImages = prevState.editedProfile.images.slice();
                  newImages.splice(index, 1);
                  newImages[3] = null;
                  return {
                    editedProfile: {
                      ...prevState.editedProfile,
                      images: newImages
                    }
                  };
                });
              }}
            />
          </View>
          <View style={styles.profileBlock}>
            <PrimaryInput
              value={this.state.editedProfile.displayName}
              label="Preferred Name"
              onChange={this._onChangeName}
              error={this.state.errorMessageName}
              containerStyle={{ width: "100%" }}
              assistive={""}
              autoCapitalize={"words"}
            />
            <BioInput
              value={this.state.editedProfile.bio}
              onChangeText={this._onChangeBio}
              label={"About Me"}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileEditScreen);
