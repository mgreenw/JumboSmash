// @flow
import React from "react";
import { Text, View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { textStyles } from "mobile/styles/textStyles";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type { UserSettings, UserProfile, Genders } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import { OnboardingLayout } from "./Onboarding_Layout";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import GEMHeader from "mobile/components/shared/Header";
import { Transition } from "react-navigation-fluid-transitions";
import { PrimaryButton } from "mobile/components/shared/PrimaryButton";

type Props = {
  navigation: any
};

type State = {
  profile: UserProfile,
  settings: UserSettings
};

export default class OnboardingTermsAndConditionsScreen extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      profile: navigation.getParam("profile", null),
      settings: navigation.getParam("settings", null)
    };
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.OnboardingNameAge, {
      profile: this.state.profile,
      settings: this.state.settings
    });
  };

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader leftIconName={"back"} title={"T & C"} loading={false} />
        <Transition inline appear={"horizontal"}>
          <View style={{ flex: 1 }}>
            <ScrollView>
              <View style={{ paddingLeft: 38, paddingRight: 38 }}>
                <Text style={textStyles.body2Style}>
                  {`

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla blandit laoreet quam, vel aliquet dolor hendrerit sit amet. Mauris ultrices euismod turpis. Integer lacinia odio vitae ex luctus scelerisque. Praesent purus mi, mollis eu lacus at, commodo suscipit ante. Duis ac commodo ipsum. Etiam quis nibh vestibulum, maximus purus in, lacinia ligula. Phasellus in porttitor quam. Morbi eget pretium elit, in ullamcorper massa. Cras id fermentum lacus. Fusce ullamcorper eu mauris imperdiet vehicula.

Vestibulum id velit congue, pharetra elit ut, gravida est. Fusce congue placerat risus et tristique. Pellentesque a dolor nec libero lobortis efficitur. Etiam tincidunt bibendum libero et rhoncus. Duis vehicula est vitae elit ultrices lacinia. Pellentesque ut eros ut nisl convallis viverra faucibus sit amet libero. Curabitur non lacus arcu. Suspendisse ac nibh ac velit luctus lacinia. Praesent ultrices eu purus ut pharetra. Nulla sagittis, dolor ut volutpat egestas, turpis massa sagittis urna, eget vulputate nulla nisi egestas velit. Integer malesuada aliquam libero at interdum. Nulla turpis est, finibus sit amet posuere at, condimentum vitae purus. Quisque tempus massa at tempus fermentum. Sed tempor mi vel viverra porttitor.

Proin et sem dapibus sapien vestibulum pulvinar. Sed lobortis imperdiet est, sed elementum elit luctus sed. Nam volutpat euismod mi a lobortis. Proin eget neque lobortis, tincidunt purus venenatis, ultrices arcu. Nunc arcu diam, dapibus eleifend purus et, pharetra finibus mi. Pellentesque sollicitudin est ac nulla porttitor tincidunt. Nam vitae enim orci. Curabitur semper bibendum arcu, id dictum velit semper eu.

Mauris ullamcorper vulputate arcu vel congue. Nulla rutrum lacus ut porta vestibulum. Cras molestie ultricies libero, in vehicula tellus suscipit et. Morbi porttitor non lacus eu luctus. Integer mattis neque non tortor volutpat consectetur. Fusce rhoncus ante vitae leo ornare tincidunt vitae vitae magna. Sed pulvinar eros vitae ligula auctor, laoreet venenatis velit tempor. Aenean quis laoreet neque. Maecenas facilisis dolor sit amet sem vulputate vestibulum. Nunc commodo leo ac erat gravida, non convallis ante aliquam. Vivamus congue, augue ac dignissim porttitor, turpis eros lobortis nisl, at hendrerit velit mi vitae justo.

Vivamus ac massa ac nunc fringilla auctor at vitae odio. Morbi tincidunt consequat dignissim. Cras felis augue, vulputate nec massa nec, semper consequat nulla. Suspendisse ultrices hendrerit est, ut condimentum ex ullamcorper nec. Sed vitae nibh at orci convallis luctus sed eu nisi. Suspendisse quis tempor urna. Duis nec enim sit amet est vestibulum suscipit quis non ex. Etiam a tortor quis ex sollicitudin pharetra. Etiam non mi massa. Aliquam at ullamcorper augue, nec dignissim est. Etiam ut metus tincidunt, imperdiet ex a, pretium nunc. Vestibulum quis ex ultrices, tristique nunc ut, tincidunt magna. Duis egestas cursus est nec congue. Pellentesque a bibendum elit, placerat blandit sem. Aenean vitae nulla eget mi commodo tristique vel id purus. Donec non velit sit amet ex aliquam maximus. `}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  paddingTop: 35,
                  paddingBottom: 35
                }}
              >
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    onPress={this._goToNextPage}
                    title={"Accept"}
                    loading={false}
                    disabled={false}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </ScrollView>
          </View>
        </Transition>
      </View>
    );
  }
}
