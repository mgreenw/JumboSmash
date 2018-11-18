// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { PronounSelector } from "mobile/components/shared/PronounSelector";
import type { Pronouns } from "mobile/reducers/";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";

type Props = {
  navigation: any
};

type State = {
  wantPronouns: Pronouns
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingWantPronounsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      wantPronouns: {
        he: true,
        she: true,
        they: true
      }
    };
  }

  _onWantPronounChange = (pronouns: Pronouns) => {
    this.setState({
      wantPronouns: pronouns
    });
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate("OnboardingAddPictures");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.onboardingHeader}>
            Pronoun Preferences
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>
            We use pronouns to help determine who to show in your stack in
            Project GEM. Your pronouns will not be shown on your profile.
          </Text>
          <Text>{"I'm looking for:"}</Text>
          <PronounSelector
            defaultPronouns={this.state.wantPronouns}
            onChange={this._onWantPronounChange}
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
)(OnboardingWantPronounsScreen);
