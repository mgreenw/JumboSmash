// @flow

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Button, Icon } from "react-native-elements";
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
          onPress={() => navigation.navigate(routes.Cards)}
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
