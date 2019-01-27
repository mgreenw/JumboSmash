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
      <View style={Arthur_Styles.container}>
        <GEMHeader
          title={"Having Trouble?"}
          leftIconName={"back"}
          loading={false}
        />
        <View style={{ flex: 1.5 }} />
        <View style={{ flex: 2, paddingLeft: 40, paddingRight: 40 }}>
          <Text style={[textStyles.body1Style, { textAlign: "center" }]}>
            {
              "If you’re a senior and are having trouble logging in or signing up, email us at jumbosmash19@gmail.com from your .edu email, and the team will get you set up."
            }
          </Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            flex: 5
          }}
        >
          <PrimaryButton
            onPress={() => Linking.openURL("mailto:jumbosmash19@gmail.com")}
            title="Email the Team"
            disabled={false}
            loading={false}
          />
        </View>
        <Image
          resizeMode="stretch"
          source={require("../../../assets/waves/waves1/waves.png")}
          style={Arthur_Styles.waves}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthHelpScreen);
