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
  firstScreen?: boolean,
  lastScreen?: boolean,
  progress?: number,
  loading?: boolean,
  buttonDisabled?: boolean
};
type State = {};

export class OnboardingLayout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  // TODO: header / progress and stuff
  render() {
    const {
      firstScreen,
      lastScreen,
      loading,
      onButtonPress,
      title,
      body,
      buttonText,
      progress,
      buttonDisabled
    } = this.props;
    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader
          screen={firstScreen ? "onboarding-start" : "onboarding-main"}
          loading={loading}
        />
        <KeyboardView>
          <Transition inline appear={"horizontal"}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 2 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  // TODO: also add the progress
                  <View>
                    <Text
                      style={
                        firstScreen || lastScreen
                          ? textStyles.veganTitle
                          : Arthur_Styles.onboardingHeader
                      }
                    >
                      {title}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 2, paddingLeft: 22, paddingRight: 22 }}>
                  {body}
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    onPress={onButtonPress}
                    title={buttonText || "continue"}
                    loading={loading}
                    disabled={buttonDisabled}
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
