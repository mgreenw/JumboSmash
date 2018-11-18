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
const SPLASH_ROUTE = "SPLASH_ROUTE";
const VERIFY_ROUTE = "VERIFY_ROUTE";
const EXPIRED_CODE_ROUTE = "EXPIRED_CODE_ROUTE";
const NOT2019_ROUTE = "NOT2019_ROUTE";
const AUTH_HELP_ROUTE = "AUTH_HELP_ROUTE";

const ONBOARDING_START_ROUTE = "ONBOARDING_START_ROUTE";
const ONBOARDING_NAME_AGE_ROUTE = "ONBOARDING_NAME_AGE_ROUTE";
const ONBOARDING_MY_PRONOUNS_ROUTE = "ONBOARDING_MY_PRONOUNS_ROUTE";
const ONBOARDING_WANT_PRONOUNS_ROUTE = "ONBOARDING_WANT_PRONOUNS_ROUTE";
const ONBOARDING_ADD_PICTURES_ROUTE = "ONBOARDING_ADD_PICTURES_ROUTE";
const ONBOARDING_BIO_ROUTE = "ONBOARDING_BIO_ROUTE";
const ONBOARDING_NOTIFICATIONS_ROUTE = "ONBOARDING_NOTIFICATIONS_ROUTE";
const ONBOARDING_FINISH_ROUTE = "ONBOARDING_FINISH_ROUTE";

export const routes = {
  Profile: PROFILE_ROUTE,
  Matches: MATCHES_ROUTE,
  Cards: CARDS_ROUTE,
  SettingsEdit: SETTINGS_EDIT_ROUTE,
  ProfileEdit: PROFILE_EDIT_ROUTE,
  CardsStack: CARDS_STACK,
  ProfileStack: PROFILE_STACK,
  MatchesStack: MATCHES_STACK,
  Splash: SPLASH_ROUTE,
  Verify: VERIFY_ROUTE,
  ExpiredCode: EXPIRED_CODE_ROUTE,
  Not2019: NOT2019_ROUTE,
  AuthHelp: AUTH_HELP_ROUTE,
  OnboardingStart: ONBOARDING_START_ROUTE,
  OnboardingNameAge: ONBOARDING_NAME_AGE_ROUTE,
  OnboardingMyPronouns: ONBOARDING_MY_PRONOUNS_ROUTE,
  OnboardingWantPronouns: ONBOARDING_WANT_PRONOUNS_ROUTE,
  OnboardingAddPictures: ONBOARDING_ADD_PICTURES_ROUTE,
  OnboardingBio: ONBOARDING_BIO_ROUTE,
  OnboardingNotifications: ONBOARDING_NOTIFICATIONS_ROUTE,
  OnboardingFinish: ONBOARDING_FINISH_ROUTE
};
// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const CardsStack = createStackNavigator(
  {
    CARDS_ROUTE: { screen: Cards }
  },
  {
    initialRouteName: CARDS_ROUTE
  }
);

const ProfileStack = createStackNavigator(
  {
    PROFILE_ROUTE: { screen: Profile },
    SETTINGS_EDIT_ROUTE: { screen: SettingsEdit },
    PROFILE_EDIT_ROUTE: { screen: ProfileEdit }
  },
  {
    initialRouteName: PROFILE_ROUTE
  }
);

const MatchesStack = createStackNavigator(
  {
    MATCHES_ROUTE: { screen: Matches }
  },
  {
    initialRouteName: MATCHES_ROUTE
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
    initialRouteName: CARDS_STACK
  }
);

const LoginStack = createStackNavigator(
  {
    SPLASH_ROUTE: { screen: Splash },
    VERIFY_ROUTE: { screen: Verify },
    EXPIRED_CODE_ROUTE: { screen: ExpiredCode },
    NOT2019_ROUTE: { screen: Not2019 },
    AUTH_HELP_ROUTE: { screen: Help }
  },
  {
    initialRouteName: SPLASH_ROUTE
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
    ONBOARDING_START_ROUTE: { screen: OnboardingStart },
    ONBOARDING_NAME_AGE_ROUTE: { screen: OnboardingNameAge },
    ONBOARDING_MY_PRONOUNS_ROUTE: { screen: OnboardingMyPronouns },
    ONBOARDING_WANT_PRONOUNS_ROUTE: { screen: OnboardingWantPronouns },
    ONBOARDING_ADD_PICTURES_ROUTE: { screen: OnboardingAddPictures },
    ONBOARDING_BIO_ROUTE: { screen: OnboardingBio },
    ONBOARDING_NOTIFICATIONS_ROUTE: { screen: OnboardingNotifications },
    ONBOARDING_FINISH_ROUTE: { screen: OnboardingFinish }
  },
  {
    initialRouteName: ONBOARDING_START_ROUTE,
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
