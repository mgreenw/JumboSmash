// @flow

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { styles } from "../../../styles/template";
import { Button, Icon } from "react-native-elements";

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

class MessagingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Messaging",
      headerLeft: (
        <Icon
          name="diamond"
          type="font-awesome"
          size={40}
          onPress={() => navigation.navigate("Swiping")}
          containerStyle={{ paddingLeft: 10 }}
        />
      )
    };
  };

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>PROJECT GEM: MESSAGING</Text>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
