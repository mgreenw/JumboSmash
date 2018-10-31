// @flow

import React from "react";
import { Button, Text, View } from "react-native";
import { connect } from "react-redux";
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

class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _goToMessaging = () => {
    const { navigate } = this.props.navigation;
    navigate("messaging");
  };

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Swiping",
      headerRight: (
        <Button
          title="Messaging ->"
          onPress={() => navigation.navigate("Messaging")}
        />
      ),
      headerLeft: (
        <Button
          title="<- Profile"
          onPress={() => navigation.navigate("Profile")}
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
          <Text style={styles.title}>PROJECT GEM: SWIPING</Text>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipingScreen);
