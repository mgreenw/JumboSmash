// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { textStyles } from "mobile/styles/textStyles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type {
  UserSettings,
  UserProfile,
  Pronouns
} from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { OnboardingLayout } from "./Onboarding_Layout";
import AddPhotos from "mobile/components/shared/AddPhotos";

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingAddPicturesScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam("profile", null),
      settings: navigation.getParam("settings", null)
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state != prevState) {
      const { navigation } = this.props;
      navigation.state.params.onUpdateProfileSettings(
        this.state.profile,
        this.state.settings
      );
    }
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingBio, {
      profile: this.state.profile,
      settings: this.state.settings,
      onUpdateProfileSettings: (
        profile: UserProfile,
        settings: UserSettings
      ) => {
        this.setState({
          profile,
          settings
        });
      }
    });
  };

  render() {
    return (
      <OnboardingLayout
        body={
          <AddPhotos
            images={this.state.profile.images}
            onChangeImages={images => {
              this.setState(prevState => {
                return {
                  profile: {
                    ...prevState.profile,
                    images
                  }
                };
              });
            }}
          />
        }
        onButtonPress={this._goToNextPage}
        title="Upload Photos"
        main={true}
        progress={0}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingAddPicturesScreen);
