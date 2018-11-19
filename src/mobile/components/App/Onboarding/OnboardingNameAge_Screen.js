// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import type {
  UserSettings,
  UserProfile,
  Pronouns
} from "mobile/reducers/index";
import { HeaderBackButton } from "react-navigation";
import { routes } from "mobile/components/Navigation";

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
    return (
      <View style={Arthur_Styles.container}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.onboardingHeader}>Name & Age</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Input
            placeholderTextColor={"#DDDDDD"}
            inputStyle={{ color: "#222222" }}
            labelStyle={styles.labelStyle}
            label="Name"
            value={this.state.profile.displayName}
            placeholder="Tony Monaco"
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
            placeholderTextColor={"#DDDDDD"}
            inputStyle={{ color: "#222222" }}
            labelStyle={styles.labelStyle}
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
)(NameAgeScreen);
