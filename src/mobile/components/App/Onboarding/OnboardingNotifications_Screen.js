// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
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

class OnboardingNotificationsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam("profile", null),
      settings: navigation.getParam("settings", null)
    };
  }

  _enableNotifications = () => {
    //TODO: enable notifications
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingFinish, {
      profile: this.state.profile,
      settings: this.state.settings
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Push Notifications</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={Arthur_Styles.onboardingHeader}>
            We use push notifications to let you know when you have a new match
            or message.
          </Text>
        </View>
        <View
          style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
        >
          <PrimaryButton
            onPress={this._enableNotifications}
            title="Enable Push Notifications"
          />
          // TODO: make secondary button
          <PrimaryButton onPress={this._goToNextPage} title="skip" />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingNotificationsScreen);
