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
import Matches from "mobile/components/App/Main/Matches/Matches_Screen";

// OnBoarding Screens
import OnboardingStart from "mobile/components/App/Onboarding/OnboardingStart_Screen";
import OnboardingNameAge from "mobile/components/App/Onboarding/OnboardingNameAge_Screen";
import OnboardingMyPronouns from "mobile/components/App/Onboarding/OnboardingMyPronouns_Screen";
import OnboardingWantPronouns from "mobile/components/App/Onboarding/OnboardingWantPronouns_Screen";
import OnboardingAddPictures from "mobile/components/App/Onboarding/OnboardingAddPictures_Screen";
import OnboardingBio from "mobile/components/App/Onboarding/OnboardingBio_Screen";
import OnboardingNotifications from "mobile/components/App/Onboarding/OnboardingNotifications_Screen";
import OnboardingFinish from "mobile/components/App/Onboarding/OnboadingFinish_Screen";

const PROFILE_ROUTE = "PROFILE_ROUTE";
const MATCHES_ROUTE = "MATCHES_ROUTE";
const CARDS_ROUTE = "CARDS_ROUTE";
const SETTINGS_EDIT_ROUTE = "SETTINGS_EDIT_ROUTE";
const PROFILE_EDIT_ROUTE = "PROFILE_EDIT_ROUTE";
const CARDS_STACK = "CARDS_STACK";
const PROFILE_STACK = "PROFILE_STACK";
const MATCHES_STACK = "MATCHES_STACK";
const LOGIN_STACK = "LOGIN_STACK";
const AUTH_LOADING_ROUTE = "AUTH_LOADING_ROUTE";

export const routes = {
  Profile: PROFILE_ROUTE,
  Matches: MATCHES_ROUTE,
  Cards: CARDS_ROUTE,
  SettingsEdit: SETTINGS_EDIT_ROUTE,
  ProfileEdit: PROFILE_EDIT_ROUTE,
  CardsStack: CARDS_STACK,
  ProfileStack: PROFILE_STACK,
  MatchesStack: MATCHES_STACK,
  LoginStack: LOGIN_STACK,
  AuthLoading: AUTH_LOADING_ROUTE
};
// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const CardsStack = createStackNavigator(
  {
    CARDS_ROUTE: { screen: Cards }
  },
  {
    initialRouteName: "CARDS_ROUTE"
  }
);

const ProfileStack = createStackNavigator(
  {
    PROFILE_ROUTE: { screen: Profile },
    SETTINGS_EDIT_ROUTE: { screen: SettingsEdit },
    PROFILE_EDIT_ROUTE: { screen: ProfileEdit }
  },
  {
    initialRouteName: "PROFILE_ROUTE"
  }
);

const MatchesStack = createStackNavigator(
  {
    MATCHES_ROUTE: { screen: Matches }
  },
  {
    initialRouteName: "MATCHES_ROUTE"
  }
);

// This is a switch because we are difining our own interface between
// the pages. (NOT tabs, but headerbar navigation!)
const MainContentSwitch = createSwitchNavigator(
  {
    CARDS_STACK: CardsStack,
    PROFILE_STACK: ProfileStack,
    MATCHES_STACK: MatchesStack
  },
  {
    initialRouteName: "CARDS_STACK"
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
    LOGIN_STACK: LoginStack,
    AUTH_LOADING_ROUTE: { screen: AuthLoading }
  },
  {
    initialRouteName: "AUTH_LOADING_ROUTE"
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
    OnboardingNotifications: { screen: OnboardingNotifications },
    OnboardingFinish: { screen: OnboardingFinish }
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
    initialRouteName: "AppLoading"
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
