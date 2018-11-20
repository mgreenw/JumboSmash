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
import type { UserSettings, UserProfile } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { createUser } from "mobile/actions/app/createUser";

type Props = {
  navigation: any,
  token: string,
  createUser: (
    token: string,
    profile: UserProfile,
    settings: UserSettings
  ) => void
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {
    token: reduxState.token
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {
    createUser: (
      token: string,
      profile: UserProfile,
      settings: UserSettings
    ) => {
      dispatch(createUser(token, profile, settings));
    }
  };
}

class OnboardingFinishScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam("profile", null),
      settings: navigation.getParam("settings", null)
    };
  }

  _saveSettingsAndProfile = () => {
    // const { navigation } = this.props;
    // navigation.navigate(routes.MainSwitch);
    this.props.createUser(
      this.props.token,
      this.state.profile,
      this.state.settings
    );
    //  this.props.saveSettings(this.props.token, this.state.settings);
  };

  render() {
    return (
      <View style={Arthur_Styles.container}>
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
            {"time2swipe!"}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <PrimaryButton
              onPress={this._saveSettingsAndProfile}
              title="Roll 'Bos"
            />
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
)(OnboardingFinishScreen);
