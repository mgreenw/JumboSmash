// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "../../styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../reducers/index";
import { PronounSelector } from "../shared/PronounSelector";
import type { Pronouns } from "../shared/PronounSelector";

type Props = {
  navigation: any
};

type State = {
  myPronouns: Pronouns
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingMyPronounsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      myPronouns: {
        he: true,
        she: true,
        they: true
      }
    };
  }

  _onMyPronounChange = (pronouns: Pronouns) => {
    this.setState({
      myPronouns: pronouns
    });
  };

  _onPress = () => {
    const { navigation } = this.props;
    //TODO: add navigation to next screen
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
          GEM. Your pronouns will not be shown on your profile.{" "}
        </Text>
        <Text>I use:</Text>
        <PronounSelector
          defaultPronouns={this.state.myPronouns}
          onChange={this._onMyPronounChange}
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
)(OnboardingMyPronounsScreen);
