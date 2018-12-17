// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import type {
  UserSettings,
  UserProfile,
  Pronouns
} from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import GEMHeader from "mobile/components/shared/Header";
import { Transition } from "react-navigation-fluid-transitions";

type ReduxProps = {};
type DispatchProps = {};

type Props = ReduxProps &
  DispatchProps & {
    navigation: any,
    first: ?boolean, // flag to indicate first screen, useful for header
    nextText: string,
    nextRoute: string, // should be an onboarding route. I think typing that is overkill.
    title:
  };

type State = {
  profile: UserProfile,
  settings: UserSettings
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  return {};
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): DispatchProps {
  return {};
}

class OnboardingTemplate extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    let propsProfile: ?UserProfile = navigation.getParam("profile", null);
    let propsSettings: ?UserSettings = navigation.getParam("settings", null);
    this.state = {
      profile: propsProfile || {
        bio: "foo",
        birthday: "1997-06-26",
        displayName: "Jacob",
        images: []
      },
      settings: propsSettings || {
        usePronouns: {
          he: true,
          she: true,
          they: true
        },
        wantPronouns: {
          he: true,
          she: true,
          they: true
        }
      }
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
    navigation.navigate(this.props.nextRoute, {
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
        <GEMHeader screen="onboarding-start" />
        <Transition inline appear={"horizontal"}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={Arthur_Styles.title}>Project Gem</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 34,
                  marginLeft: 22,
                  marginRight: 22,
                  textAlign: "center"
                }}
              >
                {
                  "Let's take 2 minutes to get your profile setup before you begin swiping"
                }
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1 }}>
                <PrimaryButton onPress={this._goToNextPage} title="Roll 'Bos" />
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </Transition>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingTemplate);
