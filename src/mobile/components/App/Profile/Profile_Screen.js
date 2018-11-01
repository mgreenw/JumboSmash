// @flow

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { styles } from "../../../styles/template";

type Props = {
  navigation: any
};

type State = {};

function mapStateToProps(state: State, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: State, ownProps: Props) {
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
        <Button
          title="Swiping ->"
          onPress={() => navigation.navigate("Swiping")}
        />
      )
    };
  };

  _onSettingsPress = () => {
    const { navigate } = this.props.navigation;
    navigate("Settings", {});
  };

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "space-evenly" }}>
          <Text style={styles.title}>PROJECT GEM: PROFILE</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "space-evenly" }}>
          <Button title="Edit Profile" buttonStyle={styles.button} />
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
