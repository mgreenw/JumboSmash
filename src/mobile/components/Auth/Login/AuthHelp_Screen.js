// @flow
import React from "react";
import { Text, View, Image, Linking } from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/auth";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { textStyles } from "mobile/styles/textStyles";
import { routes } from "mobile/components/Navigation";
import GEMHeader from "mobile/components/shared/Header";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import AuthLayout from "mobile/components/Auth/Login/Layout";

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

class AuthHelpScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <AuthLayout
        title={"Having Trouble?"}
        bodyText={
          "If you’re a senior and are having trouble logging in or signing up, email us at jumbosmash19@gmail.com from your .edu email, and the team will get you set up."
        }
        buttonText={"Email the Team"}
        onButtonPress={() => Linking.openURL("mailto:jumbosmash19@gmail.com")}
        loading={false}
        buttonDisabled={false}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthHelpScreen);
