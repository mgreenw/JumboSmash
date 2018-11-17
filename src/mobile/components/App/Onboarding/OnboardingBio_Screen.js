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
<<<<<<< HEAD
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <Button
              onPress={this._goToNextPage}
              title="Continue"
              buttonStyle={Arthur_Styles.buttonPrimaryActive}
              titleStyle={Arthur_Styles.buttonTitlePrimaryActive}
              disabledStyle={Arthur_Styles.buttonPrimaryDisabled}
            />
          </View>
          <View style={{ flex: 1 }} />
=======
        <View style={{ flex: 1 }}>
          <Button
            onPress={this._goToNextPage}
            title="Continue"
            buttonStyle={styles.button}
          />
>>>>>>> a6a06f8c0083710ce85ef723b4f4454596395919
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingBioScreen);
