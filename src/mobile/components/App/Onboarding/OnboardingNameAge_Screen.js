// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { Input } from "react-native-elements";
import { textStyles } from "mobile/styles/textStyles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type {
  UserSettings,
  UserProfile,
  Pronouns
} from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { OnboardingLayout } from "./Onboarding_Layout";

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class NameAgeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam("profile", null),
      settings: navigation.getParam("settings", null)
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state != prevState) {
      const { navigation } = this.props;
      navigation.state.params.onUpdateProfileSettings(
        this.state.profile,
        this.state.settings
      );
    }
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingMyPronouns, {
      profile: this.state.profile,
      settings: this.state.settings,
      onUpdateProfileSettings: (
        profile: UserProfile,
        settings: UserSettings
      ) => {
        this.setState({
          profile,
          settings
        });
      }
    });
  };

  render() {
    const body = (
      <View style={{ flex: 1 }}>
        <Input
          value={this.state.profile.displayName}
          placeholder="Preferred Name"
          onChangeText={name =>
            this.setState((state, props) => {
              return {
                profile: {
                  ...this.state.profile,
                  displayName: name
                }
              };
            })
          }
          autoCorrect={false}
        />
        <Input
          label="Birthday"
          value={this.state.profile.birthday}
          placeholder="01/01/97"
          onChangeText={birthday =>
            this.setState((state, props) => {
              return {
                profile: {
                  ...this.state.profile,
                  birthday: birthday
                }
              };
            })
          }
          autoCorrect={false}
        />
      </View>
    );
    return (
      <OnboardingLayout
        body={body}
        onButtonPress={this._goToNextPage}
        title="Name & Age"
        main={true}
        progress={0}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameAgeScreen);
