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

type State = {
  classYear: number
};

function mapStateToProps(state, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch, ownProps: Props) {
  return {};
}

class Not2019Screen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    const { navigation } = this.props;
    this.state = {
      classYear: navigation.getParam("classYear", "")
    };
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

  render() {
    const yearsLeft = this.state.classYear - 19;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={{ flex: 1, alignSelf: "stretch", width: "100%" }}>
          <Text style={styles.title}>{"Sucks to suck! Try again in " + yearsLeft +
          ((yearsLeft == -1 || yearsLeft == 1) ? ' year.' : ' years.')}</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Not2019Screen);
