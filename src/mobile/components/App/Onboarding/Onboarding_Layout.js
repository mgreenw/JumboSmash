// @flow
import * as React from "react"; // need this format to access children
import { Text, View } from "react-native";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { textStyles } from "mobile/styles/textStyles";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";
import type { UserSettings, UserProfile } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import GEMHeader from "mobile/components/shared/Header";
import { Transition } from "react-navigation-fluid-transitions";
import { KeyboardView } from "mobile/components/shared/KeyboardView";

type Props = {
  body: React.Node,
  onButtonPress: () => void,
  title: string,
  buttonText?: string,
  first?: boolean,
  last?: boolean,
  progress?: number,
  loading?: boolean
};
type State = {};

export class OnboardingLayout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  // TODO: header / progress and stuff
  render() {
    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader
          screen={this.props.first ? "onboarding-start" : "onboarding-main"}
          loading={this.props.loading}
        />
        <KeyboardView>
          <Transition inline appear={"horizontal"}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 2 }}>
                <View style={{ flex: 1, justifyContent: "space-around" }}>
                  {this.props.first || this.props.last ? (
                    <Text style={textStyles.veganTitle}>
                      {this.props.title}
                    </Text>
                  ) : (
                    // TODO: also add the progress
                    <Text style={Arthur_Styles.onboardingHeader}>
                      {this.props.title}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 2 }}>{this.props.body} </View>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    onPress={this.props.onButtonPress}
                    title={this.props.buttonText || "continue"}
                    loading={this.props.loading}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </Transition>
        </KeyboardView>
      </View>
    );
  }
}
