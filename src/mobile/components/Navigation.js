// @flow
import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from "react-navigation";

//////////
// AUTH:
//////////

// Entry point; used to load from phone storage & determine route
import AuthLoading from "mobile/components/Auth/AuthLoading_Screen";

// Login Screens
import Splash from "mobile/components/Auth/Login/Splash_Screen";
import Verify from "mobile/components/Auth/Login/Verify_Screen";
import ExpiredCode from "mobile/components/Auth/Login/ExpiredCode_Screen";
import Not2019 from "mobile/components/Auth/Login/Not2019_Screen";
import Help from "mobile/components/Auth/Login/Help_Screen";

/////////
// APP:
/////////

import AppLoading from "mobile/components/App/AppLoading_Screen";

// Main App Screens
import Profile from "mobile/components/App/Main/Profile/Profile_Screen";
import ProfileEdit from "mobile/components/App/Main/Profile/ProfileEdit_Screen";
import SettingsEdit from "mobile/components/App/Main/Profile/SettingsEdit_Screen";

import Cards from "mobile/components/App/Main/Cards/Cards_Screen";
import Messaging from "mobile/components/App/Main/Matches/Matches_Screen";

// OnBoarding Screens
import OnboardingStart from "mobile/components/App/Onboarding/OnboardingStart_Screen";
import OnboardingNameAge from "mobile/components/App/Onboarding/OnboardingNameAge_Screen";
import OnboardingMyPronouns from "mobile/components/App/Onboarding/OnboardingMyPronouns_Screen";
import OnboardingWantPronouns from "mobile/components/App/Onboarding/OnboardingWantPronouns_Screen";
import OnboardingAddPictures from "mobile/components/App/Onboarding/OnboardingAddPictures_Screen";
import OnboardingBio from "mobile/components/App/Onboarding/OnboardingBio_Screen";
import OnboardingNotifications from "mobile/components/App/Onboarding/OnboardingNotifications_Screen";

const PROFILE_ROUTE = "Profile";

export const routes = {
  Profile: PROFILE_ROUTE
};
// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const CardsStack = createStackNavigator(
  {
    Cards: { screen: Cards }
  },
  {
    initialRouteName: "Cards"
  }
);

const ProfileStack = createStackNavigator(
  {
    PROFILE_ROUTE: { screen: Profile },
    SettingsEdit: { screen: SettingsEdit },
    ProfileEdit: { screen: ProfileEdit }
  },
  {
    initialRouteName: "PROFILE_ROUTE"
  }
);

const MatchesStack = createStackNavigator(
  {
    Messaging: { screen: Messaging }
  },
  {
    initialRouteName: "Messaging"
  }
);

// This is a switch because we are difining our own interface between
// the pages. (NOT tabs, but headerbar navigation!)
const MainContentSwitch = createSwitchNavigator(
  {
    Cards: CardsStack,
    Profile: ProfileStack,
    Matches: MatchesStack
  },
  {
    initialRouteName: "Cards"
  }
);

const LoginStack = createStackNavigator(
  {
    Splash: { screen: Splash },
    Verify: { screen: Verify },
    ExpiredCode: { screen: ExpiredCode },
    Not2019: { screen: Not2019 },
    AuthHelp: { screen: Help }
  },
  {
    initialRouteName: "Splash"
  }
);

const AuthSwitch = createSwitchNavigator(
  {
    Login: LoginStack,
    AuthLoading: { screen: AuthLoading }
  },
  {
    initialRouteName: "AuthLoading"
  }
);

const OnboardingStack = createStackNavigator(
  {
    OnboardingStart: { screen: OnboardingStart },
    OnboardingNameAge: { screen: OnboardingNameAge },
    OnboardingMyPronouns: { screen: OnboardingMyPronouns },
    OnboardingWantPronouns: { screen: OnboardingWantPronouns },
    OnboardingAddPictures: { screen: OnboardingAddPictures },
    OnboardingBio: { screen: OnboardingBio },
    OnboardingNotifications: { screen: OnboardingNotifications }
  },
  {
    initialRouteName: "OnboardingStart",
    navigationOptions: {
      headerBackTitle: null,
      headerStyle: {
        borderBottomWidth: 0
      },
      title: "Profile Setup"
    }
  }
);

const AppSwitch = createSwitchNavigator(
  {
    Main: MainContentSwitch,
    Onboarding: OnboardingStack,
    AppLoading: { screen: AppLoading }
  },
  {
    initialRouteName: "Main"
  }
);

export const createRootNavigator = () => {
  return createSwitchNavigator(
    {
      App: AppSwitch,
      Auth: AuthSwitch
    },
    {
      initialRouteName: "Auth"
    }
  );
};
