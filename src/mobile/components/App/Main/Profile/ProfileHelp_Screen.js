// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/auth";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";

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

class HelpScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <Text style={styles.title}>Help & Contact</Text>
        <Text style={{ textAlign: "center" }}>NEED HELP?</Text>
        <Text style={{ textAlign: "center" }}>
          Send us an email and we'll get back to you the moment our team is
          sober.
        </Text>
        <Button title="team@jumbosmash.com" buttonStyle={styles.button} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpScreen);
