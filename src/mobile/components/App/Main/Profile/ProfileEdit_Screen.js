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
import { styles } from "mobile/styles/template";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GEMHeader from "mobile/components/shared/Header";
import type { UserProfile } from "mobile/reducers";
import { PrimaryInput } from "mobile/components/shared/PrimaryInput";
import { saveProfile } from "mobile/actions/app/saveProfile";
import NavigationService from "mobile/NavigationService";

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
  errorMessageName: string
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
      errorMessageName: ""
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
    const spacer = (
      <View style={{ width: "100%", height: 25, backgroundColor: "#38c7cc" }} />
    );

    return (
      <View style={{ flex: 1 }}>
        <GEMHeader screen="profile-edit" onLeftIconPress={this._onBack} />
        <KeyboardAwareScrollView extraScrollHeight={30}>
          {spacer}
          <AddPhotos />
          {spacer}
          <View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width,
              backgroundColor: "#f0f3f5"
            }}
          >
            <View style={{ padding: 20 }}>
              <PrimaryInput
                value={this.state.editedProfile.displayName}
                label="Preferred Name"
                onChange={this._onChangeName}
                error={this.state.errorMessageName}
                containerStyle={{ width: "100%" }}
                assistive={""}
                autoCapitalize={"words"}
              />
            </View>
            <View style={{ flex: 1, padding: 20 }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1 }}
                placeholderTextColor={"#DDDDDD"}
                inputStyle={{ color: "#222222" }}
                labelStyle={styles.labelStyle}
                label="About Me"
                placeholder="Dan Katz Dan Katz"
                onChangeText={this._onChangeBio}
                ref={input => (this.bioInput = input)}
                errorMessage={""}
                autoCorrect={false}
                multiline={true}
                value={this.state.editedProfile.bio}
              />
            </View>
          </View>
          {spacer}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileEditScreen);
