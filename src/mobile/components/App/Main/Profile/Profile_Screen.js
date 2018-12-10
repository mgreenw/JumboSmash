// @flow

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Button, Icon } from "react-native-elements";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import GEMHeader from "mobile/components/shared/Header";
import { Transition } from "react-navigation-fluid-transitions";

type Props = {
  navigation: any
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class ProfileScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => {
    return { header: null };
  };

  _onSettingsPress = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.SettingsEdit, {});
  };

  _onProfileEditPress = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.ProfileEdit, {});
  };

  _onProfileHelpPress = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.ProfileHelp, {});
  };

  render() {
    return (
      <Transition inline appear="horizontal" appear="left">
        <View style={{ flex: 1 }}>
          <GEMHeader screen="profile" />
          <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: "space-evenly" }}>
              <Text style={styles.title}>PROJECT GEM: PROFILE</Text>
            </View>
            <View style={{ flex: 1, justifyContent: "space-evenly" }}>
              <Button
                title="Edit Profile"
                buttonStyle={styles.button}
                onPress={this._onProfileEditPress}
              />
              <Button
                title="Settings"
                buttonStyle={styles.button}
                onPress={this._onSettingsPress}
              />
              <Button
                title="Help & Contact"
                buttonStyle={styles.button}
                onPress={this._onProfileHelpPress}
              />
            </View>
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </Transition>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
