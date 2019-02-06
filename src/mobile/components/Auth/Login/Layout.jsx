// @flow
import React from "react";
import { Text, View, Image } from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/auth";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { textStyles } from "mobile/styles/textStyles";
import { routes } from "mobile/components/Navigation";
import GEMHeader from "mobile/components/shared/Header";
import { PrimaryButton } from "mobile/components/shared/buttons/PrimaryButton";

type Props = {
  bodyText: string,
  onButtonPress: () => void,
  title: string,
  buttonText: string,
  loading?: boolean,
  buttonDisabled?: boolean
};

type State = {};

class AuthLayout extends React.Component<Props, State> {
  render() {
    const {
      loading,
      onButtonPress,
      title,
      bodyText,
      buttonText,
      buttonDisabled
    } = this.props;
    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader title={title} leftIconName={"back"} loading={false} />
        <View style={{ flex: 1.5 }} />
        <View style={{ flex: 2, paddingLeft: 40, paddingRight: 40 }}>
          <Text style={[textStyles.body1Style, { textAlign: "center" }]}>
            {bodyText}
          </Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            flex: 5
          }}
        >
          <PrimaryButton
            onPress={onButtonPress}
            title={buttonText}
            disabled={buttonDisabled}
            loading={loading}
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

export default AuthLayout;
