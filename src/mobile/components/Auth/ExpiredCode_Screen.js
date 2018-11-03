// @flow

import React from "react";
import { Text, View, KeyboardAvoidingView } from "react-native";
import { Button } from "react-native-elements";
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

class ExpiredCodeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

  _onResend = () => {
    console.log("will resend");
  };

  render() {
    const { navigation } = this.props;
    const email = navigation.getParam("email", "");

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Expired Verification Code</Text>
        </View>
        <View>
          <Text
          >{`Your email verification code has expired. To sign in, have a new code sent to ${email}`}</Text>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch" }}>
          <Button
            buttonStyle={styles.button}
            onPress={this._onResend}
            title="Resend Code"
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpiredCodeScreen);
