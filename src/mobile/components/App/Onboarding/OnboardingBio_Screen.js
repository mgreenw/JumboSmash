// @flow
import React from "react";
import { Text, View, TextInput } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import BioInput from "mobile/components/shared/BioInput";
import { styles } from "mobile/styles/template";
import { Colors, Arthur_Styles } from "mobile/styles/Arthur_Styles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";

type Props = {
  navigation: any
};

type State = {
  bio: string
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingBioScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bio: ""
    };
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate("OnboardingNotifications");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.onboardingHeader}>About Me</Text>
        </View>
        <View style={{ flex: 1 }}>
          <BioInput
            placeholder="The real Tony Monaco"
            onChangeText={bio => this.setState({ bio })}
            value={this.state.bio}
          />
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={this._goToNextPage} title="Continue" />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingBioScreen);
