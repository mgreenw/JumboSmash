import React from "react";
import {
  Text,
  View,
  KeyboardAvoidingView
} from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "../../styles/auth";

type Props = {
  navigation: any
};

type State = {};

function mapStateToProps(state, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch, ownProps: Props) {
  return {};
}

class Not2019Screen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>PROJECT GEM: WRONG YEAR</Text>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch", width: "100%" }}>
          <Text>{"Sucks to suck! Your year is not allowed to use Project GEM."}</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Not2019Screen);
