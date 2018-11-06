// @flow

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { styles } from "../../../styles/template";
import { Button, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../../reducers/index";

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
        <Icon
          name="send"
          type="font-awesome"
          size={40}
          onPress={() => navigation.navigate("Messaging")}
          containerStyle={{ paddingRight: 10 }}
        />
      ),
      headerLeft: (
        <Icon
          name="user"
          type="font-awesome"
          size={40}
          onPress={() => navigation.navigate("Profile")}
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
