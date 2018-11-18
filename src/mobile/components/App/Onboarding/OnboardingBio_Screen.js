// @flow
import React from "react";
import { Text, View, TextInput } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import BioInput from "mobile/components/shared/BioInput";
import { styles } from "mobile/styles/template";
import { Colors, Arthur_Styles } from "mobile/styles/Arthur_Styles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import type { UserSettings, UserProfile } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";

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

class OnboardingBioScreen extends React.Component<Props, State> {
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

  _onBioUpdate = (bio: string) => {
    this.setState((state, props) => {
      return {
        profile: {
          ...this.state.profile,
          bio: bio
        }
      };
    });
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingNotifications, {
      profile: this.state.profile,
      settings: this.state.settings
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.onboardingHeader}>About Me</Text>
        </View>
        <View style={{ flex: 1 }}>
          <BioInput
            placeholder="The real Tony Monaco"
            onChangeText={this._onBioUpdate}
            value={this.state.profile.bio}
          />
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={this._goToNextPage} title="Continue" />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingBioScreen);
