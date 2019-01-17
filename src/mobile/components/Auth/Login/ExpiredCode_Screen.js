// @flow

import React from "react";
import { Text, View, KeyboardAvoidingView, Image } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import {
  StackActions,
  NavigationActions,
  HeaderBackButton
} from "react-navigation";
import { styles } from "mobile/styles/auth";
import { sendVerificationEmail } from "mobile/actions/auth/sendVerificationEmail";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { routes } from "mobile/components/Navigation";

type Props = {
  navigation: any
};

type State = {
  isSubmitting: boolean
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class ExpiredCodeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSubmitting: false
    };
  }

  render() {
    const { navigation } = this.props;
    const email = navigation.getParam("email", "");

    return (
      <View style={Arthur_Styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Expired Verification Code</Text>
        </View>
        <View>
          <Text
          >{`Your email verification code has expired. To sign in, have a new code sent to ${email}`}</Text>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpiredCodeScreen);
