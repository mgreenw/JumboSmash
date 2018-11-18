// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import type {
  UserSettings,
  UserProfile,
  Pronouns
} from "mobile/reducers/index";
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

class OnboardingStartScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    let propsProfile: ?UserProfile = navigation.getParam("profile", null);
    let propsSettings: ?UserSettings = navigation.getParam("settings", null);
    this.state = {
      profile: propsProfile || {
        bio: "",
        birthday: "",
        displayName: "",
        images: []
      },
      settings: propsSettings || {
        usePronouns: {
          he: true,
          she: true,
          they: true
        },
        wantPronouns: {
          he: true,
          she: true,
          they: true
        }
      }
    };
  }

  static navigationOptions = {
    headerLeft: null
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingNameAge, {
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
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.title}>Project Gem</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 34,
              marginLeft: 22,
              marginRight: 22,
              textAlign: "center"
            }}
          >
            {
              "Let's take 2 minutes to get your profile setup before you begin swiping"
            }
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={this._goToNextPage} title="Roll 'Bos" />
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
)(OnboardingStartScreen);
