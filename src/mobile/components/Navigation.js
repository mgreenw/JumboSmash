// @flow
import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { FluidNavigator, Transition } from "react-navigation-fluid-transitions";

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
import AuthHelp from "mobile/components/Auth/Login/AuthHelp_Screen";

/////////
// APP:
/////////

import AppLoading from "mobile/components/App/AppLoading_Screen";

// Main App Screens
import Profile from "mobile/components/App/Main/Profile/Profile_Screen";
import ProfileEdit from "mobile/components/App/Main/Profile/ProfileEdit_Screen";
import SettingsEdit from "mobile/components/App/Main/Profile/SettingsEdit_Screen";
import ProfileHelp from "mobile/components/App/Main/Profile/ProfileHelp_Screen";

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
const PROFILE_HELP_ROUTE = "PROFILE_HELP_ROUTE";
const CARDS_STACK = "CARDS_STACK";
const PROFILE_STACK = "PROFILE_STACK";
const MATCHES_STACK = "MATCHES_STACK";

export const SPLASH_ROUTE = "SPLASH_ROUTE";
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
const ONBOARDING_APP_LOAD = "ONBOARDING_APP_LOAD";

const LOGIN_STACK = "LOGIN_STACK";
const AUTH_LOADING_ROUTE = "AUTH_LOADING_ROUTE";
const MAIN_SWITCH = "MAIN_SWITCH";
const ONBOARDING_STACK = "ONBOARDING_STACK";
const APP_LOADING_ROUTE = "APP_LOADING_ROUTE";
const APP_SWITCH = "APP_SWITCH";
const AUTH_SWITCH = "AUTH_SWITCH";

export const routes = {
  Profile: PROFILE_ROUTE,
  Matches: MATCHES_ROUTE,
  Cards: CARDS_ROUTE,
  SettingsEdit: SETTINGS_EDIT_ROUTE,
  ProfileEdit: PROFILE_EDIT_ROUTE,
  ProfileHelp: PROFILE_HELP_ROUTE,
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
  OnboardingFinish: ONBOARDING_FINISH_ROUTE,
  OnboardingAppLoad: ONBOARDING_APP_LOAD,
  LoginStack: LOGIN_STACK,
  AuthLoading: AUTH_LOADING_ROUTE,
  MainSwitch: MAIN_SWITCH,
  OnboardingStack: ONBOARDING_STACK,
  AppLoading: APP_LOADING_ROUTE,
  AppSwitch: APP_SWITCH,
  AuthSwitch: AUTH_SWITCH
};
// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const removeHeader = {
  headerMode: "none",
  navigationOptions: {
    headerVisible: false
  }
};

const CardsStack = createStackNavigator(
  {
    CARDS_ROUTE: { screen: Cards }
  },
  {
    initialRouteName: CARDS_ROUTE,
    ...removeHeader
  }
);

const ProfileStack = createStackNavigator(
  {
    PROFILE_ROUTE: { screen: Profile },
    SETTINGS_EDIT_ROUTE: { screen: SettingsEdit },
    PROFILE_EDIT_ROUTE: { screen: ProfileEdit },
    PROFILE_HELP_ROUTE: { screen: ProfileHelp }
  },
  {
    initialRouteName: PROFILE_ROUTE,
    ...removeHeader
  }
);

const MatchesStack = createStackNavigator(
  {
    MATCHES_ROUTE: { screen: Matches }
  },
  {
    initialRouteName: MATCHES_ROUTE,
    ...removeHeader
  }
);

// This is a switch because we are difining our own interface between
// the pages. (NOT tabs, but headerbar navigation!)
const MainContentSwitch = FluidNavigator(
  {
    CARDS_STACK: CardsStack,
    PROFILE_STACK: ProfileStack,
    MATCHES_STACK: MatchesStack
  },
  {
    mode: "card",
    initialRouteName: CARDS_STACK,
    ...removeHeader
  }
);

const LoginStack = FluidNavigator(
  {
    SPLASH_ROUTE: { screen: Splash },
    VERIFY_ROUTE: { screen: Verify },
    EXPIRED_CODE_ROUTE: { screen: ExpiredCode },
    NOT2019_ROUTE: { screen: Not2019 },
    AUTH_HELP_ROUTE: { screen: AuthHelp }
  },
  {
    initialRouteName: SPLASH_ROUTE,
    ...removeHeader
  }
);

const AuthSwitch = FluidNavigator(
  {
    LOGIN_STACK: LoginStack,
    AUTH_LOADING_ROUTE: { screen: AuthLoading }
  },
  {
    initialRouteName: AUTH_LOADING_ROUTE,
    ...removeHeader
  }
);

const OnboardingStack = FluidNavigator(
  {
    ONBOARDING_START_ROUTE: { screen: OnboardingStart },
    ONBOARDING_NAME_AGE_ROUTE: { screen: OnboardingNameAge },
    ONBOARDING_MY_PRONOUNS_ROUTE: { screen: OnboardingMyPronouns },
    ONBOARDING_WANT_PRONOUNS_ROUTE: { screen: OnboardingWantPronouns },
    ONBOARDING_ADD_PICTURES_ROUTE: { screen: OnboardingAddPictures },
    ONBOARDING_BIO_ROUTE: { screen: OnboardingBio },
    ONBOARDING_NOTIFICATIONS_ROUTE: { screen: OnboardingNotifications },
    ONBOARDING_FINISH_ROUTE: { screen: OnboardingFinish },
    ONBOARDING_APP_LOAD: { screen: AppLoading }
  },
  {
    initialRouteName: ONBOARDING_START_ROUTE,
    ...removeHeader
  }
);

const AppSwitch = FluidNavigator(
  {
    MAIN_SWITCH: MainContentSwitch,
    ONBOARDING_STACK: OnboardingStack,
    APP_LOADING_ROUTE: { screen: AppLoading }
  },
  {
    initialRouteName: APP_LOADING_ROUTE,
    ...removeHeader
  }
);

export const createRootNavigator = () => {
  return FluidNavigator(
    {
      APP_SWITCH: AppSwitch,
      AUTH_SWITCH: AuthSwitch
    },
    {
      initialRouteName: AUTH_SWITCH,
      ...removeHeader
    }
  );
};
