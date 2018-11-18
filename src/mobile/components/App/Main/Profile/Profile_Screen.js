// @flow

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Button, Icon } from "react-native-elements";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";

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
    return {
      title: "Profile",
      headerRight: (
        <Icon
          name="diamond"
          type="font-awesome"
          size={40}
          onPress={() => navigation.navigate(routes.Cards)}
          containerStyle={{ paddingRight: 10 }}
        />
      )
    };
  };

  _onSettingsPress = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.SettingsEdit, {});
  };

  _onProfileEditPress = () => {
    const { navigate } = this.props.navigation;
    navigate("ProfileEdit", {});
  };

  render() {
    return (
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
          <Button title="Help & Contact" buttonStyle={styles.button} />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
