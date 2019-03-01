// @flow

import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';
import { FluidNavigator } from 'react-navigation-fluid-transitions';

// ////////
// AUTH:
// ////////

// Entry point; used to load from phone storage & determine route
import AuthLoading from 'mobile/components/Auth/AuthLoading_Screen';

// Login Screens
import Splash from 'mobile/components/Auth/Login/Splash_Screen';
import Verify from 'mobile/components/Auth/Login/Verify_Screen';
import ExpiredCode from 'mobile/components/Auth/Login/ExpiredCode_Screen';
import Not2019 from 'mobile/components/Auth/Login/Not2019_Screen';
import AuthHelp from 'mobile/components/Auth/Login/AuthHelp_Screen';

// ///////
// APP:
// ///////

import AppLoading from 'mobile/components/App/AppLoading_Screen';

// Main App Screens
// Profile
import Profile from 'mobile/components/App/Main/Profile/Profile_Screen';
import ProfileEdit from 'mobile/components/App/Main/Profile/ProfileEdit_Screen';
import SettingsEdit from 'mobile/components/App/Main/Profile/SettingsEdit_Screen';
import ProfileHelp from 'mobile/components/App/Main/Profile/ProfileHelp_Screen';

// Cards
import Cards from 'mobile/components/App/Main/Cards/Cards_Screen';
import ExpandedCard from 'mobile/components/App/Main/Cards/ExpandedCard_Screen';

// Messages & Matches
import Matches from 'mobile/components/App/Main/Matches/Matches_Screen';
import Message from 'mobile/components/App/Main/Matches/Message_Screen';

// OnBoarding Screens
import OnboardingStart from 'mobile/components/App/Onboarding/OnboardingStart_Screen';
import OnboardingNameAge from 'mobile/components/App/Onboarding/OnboardingNameAge_Screen';
import OnboardingGenders from 'mobile/components/App/Onboarding/OnboardingGenders_Screen';
import OnboardingAddPictures from 'mobile/components/App/Onboarding/OnboardingAddPictures_Screen';
import OnboardingBio from 'mobile/components/App/Onboarding/OnboardingBio_Screen';
import OnboardingNotifications from 'mobile/components/App/Onboarding/OnboardingNotifications_Screen';
import OnboardingFinish from 'mobile/components/App/Onboarding/OnboadingFinish_Screen';
import OnboardingTermsAndConditions from 'mobile/components/App/Onboarding/OnboardingTermsAndConditions_Screen';
import OnboardingSettingsInfo from 'mobile/components/App/Onboarding/OnboardingSettingsInfo_Screen';

import routes from './routes';
// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const removeHeader = {
  headerMode: 'none'
};

const CardsStack = createStackNavigator(
  {
    [routes.Cards]: { screen: Cards },
    [routes.CardsExpandedCard]: { screen: ExpandedCard }
  },
  {
    initialRouteName: routes.Cards,
    ...removeHeader
  }
);

CardsStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const ProfileStack = createStackNavigator(
  {
    [routes.Profile]: { screen: Profile },
    [routes.SettingsEdit]: { screen: SettingsEdit },
    [routes.ProfileEdit]: { screen: ProfileEdit },
    [routes.ProfileHelp]: { screen: ProfileHelp },
    [routes.ProfileExpandedCard]: { screen: ExpandedCard }
  },
  {
    initialRouteName: routes.Profile,
    ...removeHeader
  }
);

ProfileStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const MatchesStack = createStackNavigator(
  {
    [routes.Matches]: { screen: Matches },
    [routes.Message]: { screen: Message },
    [routes.CardsExpandedCard]: { screen: ExpandedCard }
  },
  {
    initialRouteName: routes.Matches,
    ...removeHeader
  }
);

MatchesStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

// This is a switch because we are difining our own interface between
// the pages. (NOT tabs, but headerbar navigation!)
const MainContentSwitch = createMaterialTopTabNavigator(
  {
    [routes.Cards]: CardsStack,
    [routes.Profile]: ProfileStack,
    [routes.Matches]: MatchesStack
  },
  {
    initialRouteName: routes.Cards,
    animationEnabled: true,
    order: [routes.Profile, routes.Cards, routes.Matches],

    // $FlowFixMe -- this is a hack but we want our own tab bar
    tabBarComponent: null,
    lazy: false // render all at once
  }
);

MainContentSwitch.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const LoginStack = FluidNavigator(
  {
    [routes.Splash]: { screen: Splash },
    [routes.Verify]: { screen: Verify },
    [routes.ExpiredCode]: { screen: ExpiredCode },
    [routes.Not2019]: { screen: Not2019 },
    [routes.AuthHelp]: { screen: AuthHelp }
  },
  {
    initialRouteName: routes.Splash,
    ...removeHeader
  }
);

LoginStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const AuthSwitch = FluidNavigator(
  {
    [routes.LoginStack]: LoginStack,
    [routes.AuthLoading]: { screen: AuthLoading }
  },
  {
    initialRouteName: routes.AuthLoading,
    ...removeHeader
  }
);

AuthSwitch.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const OnboardingStack = FluidNavigator(
  {
    [routes.OnboardingStart]: { screen: OnboardingStart },
    [routes.OnboardingNameAge]: { screen: OnboardingNameAge },
    [routes.OnboardingGenders]: { screen: OnboardingGenders },
    [routes.OnboardingAddPictures]: { screen: OnboardingAddPictures },
    [routes.OnboardingBio]: { screen: OnboardingBio },
    [routes.OnboardingNotifications]: { screen: OnboardingNotifications },
    [routes.OnboardingFinish]: { screen: OnboardingFinish },
    [routes.OnboardingAppLoad]: { screen: AppLoading },
    [routes.OnboardingTermsAndConditions]: {
      screen: OnboardingTermsAndConditions
    },
    [routes.OnboardingSettingsInfo]: {
      screen: OnboardingSettingsInfo
    }
  },
  {
    initialRouteName: routes.OnboardingStart,
    ...removeHeader
  }
);

OnboardingStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const AppSwitch = FluidNavigator(
  {
    [routes.MainSwitch]: MainContentSwitch,
    [routes.OnboardingStack]: OnboardingStack,
    [routes.AppLoading]: { screen: AppLoading }
  },
  {
    initialRouteName: routes.AppLoading,
    ...removeHeader
  }
);

AppSwitch.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const createRootNavigator = () =>
  FluidNavigator(
    {
      [routes.AppSwitch]: AppSwitch,
      [routes.AuthSwitch]: AuthSwitch
    },
    {
      initialRouteName: routes.AuthSwitch,
      ...removeHeader
    }
  );

createRootNavigator.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

export default createRootNavigator;