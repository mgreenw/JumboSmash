// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { PronounSelector } from "mobile/components/shared/PronounSelector";
import type { Pronouns } from "mobile/components/shared/PronounSelector";

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

  _onPress = () => {
    const { navigation } = this.props;
    navigation.navigate("OnboardingAddPictures");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 34,
            marginLeft: 22,
            marginRight: 22,
            textAlign: "center"
          }}
        >
          Pronoun Preferences
        </Text>
        <Text>
          We use pronouns to help determine who to show in your stack in Project
          GEM. Your pronouns will not be shown on your profile.
        </Text>
        <Text>{"I'm looking for:"}</Text>
        <PronounSelector
          defaultPronouns={this.state.wantPronouns}
          onChange={this._onWantPronounChange}
        />
        <Button
          onPress={this._onPress}
          title="Continue"
          buttonStyle={styles.button}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingWantPronounsScreen);
