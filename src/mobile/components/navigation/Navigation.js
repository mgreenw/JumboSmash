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
import SelectCity from 'mobile/components/App/Main/Profile/SelectCity_Screen';
import SelectDorm from 'mobile/components/App/Main/Profile/SelectDorm_Screen';
import SelectArtist from 'mobile/components/App/Main/Profile/SelectArtist_Screen';

// Cards
import SmashCards from 'mobile/components/App/Main/Cards/SmashCards_Screen';
import SocialCards from 'mobile/components/App/Main/Cards/SocialCards_Screen';
import StoneCards from 'mobile/components/App/Main/Cards/StoneCards_Screen';

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

// Meta Screens
import TerminatedScreen from 'mobile/components/Auth/Terminated_Screen';
import PrelaunchWallScreen from 'mobile/components/meta/PrelaunchWall_Screen';
import PrelaunchStartScreen from 'mobile/components/meta/PrelaunchStart_Screen';

// Admin Screens
import AdminClassmateListScreen from 'mobile/components/Admin/ClassmateList_Screen';
import AdminClassmateOverviewScreen from 'mobile/components/Admin/ClassmateOverview_Screen';
import AdminHomeScreen from 'mobile/components/Admin/Home_Screen';
import AdminSettingsScreen from 'mobile/components/Admin/Settings_Screen';

import YakNewScreen from 'mobile/components/App/Main/Yak/New_Screen';
import YakListScreen from 'mobile/components/App/Main/Yak/List_Screen';

import routes from './routes';
// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const removeHeader = {
  headerMode: 'none'
};

const PrelaunchWallStack = createStackNavigator(
  {
    [routes.PrelaunchWall]: { screen: PrelaunchWallScreen },
    [routes.ProfileEdit]: { screen: ProfileEdit },
    [routes.SelectCity]: { screen: SelectCity },
    [routes.SelectDorm]: { screen: SelectDorm },
    [routes.SelectArtist]: { screen: SelectArtist }
  },
  {
    initialRouteName: routes.PrelaunchWall,
    ...removeHeader
  }
);

PrelaunchWallStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const PrelaunchStartStack = createStackNavigator(
  {
    [routes.PrelaunchStart]: { screen: PrelaunchStartScreen },
    [routes.ProfileEdit]: { screen: ProfileEdit },
    [routes.SelectCity]: { screen: SelectCity },
    [routes.SelectDorm]: { screen: SelectDorm },
    [routes.SelectArtist]: { screen: SelectArtist }
  },
  {
    initialRouteName: routes.PrelaunchStart,
    ...removeHeader
  }
);

PrelaunchStartStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const PrelaunchStack = FluidNavigator(
  {
    [routes.PrelaunchWallStack]: PrelaunchWallStack,
    [routes.PrelaunchStartStack]: PrelaunchStartStack
  },
  {
    initialRouteName: routes.PrelaunchWallStack,
    ...removeHeader
  }
);

PrelaunchStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const CardsSwitch = createMaterialTopTabNavigator(
  {
    [routes.SmashCards]: { screen: SmashCards },
    [routes.SocialCards]: { screen: SocialCards },
    [routes.StoneCards]: { screen: StoneCards }
  },
  {
    swipeEnabled: false,
    initialRouteName: routes.SmashCards,
    animationEnabled: false,
    order: [routes.SocialCards, routes.SmashCards, routes.StoneCards],
    // $FlowFixMe -- this is a hack but we want our own tab bar
    tabBarComponent: null,
    lazy: false // render all at once,
  }
);

CardsSwitch.navigationOptions = () => {
  return {
    swipeEnabled: false
  };
};

const ProfileStack = createStackNavigator(
  {
    [routes.Profile]: { screen: Profile },
    [routes.SettingsEdit]: { screen: SettingsEdit },
    [routes.ProfileEdit]: { screen: ProfileEdit },
    [routes.ProfileHelp]: { screen: ProfileHelp },
    [routes.SelectCity]: { screen: SelectCity },
    [routes.SelectDorm]: { screen: SelectDorm },
    [routes.SelectArtist]: { screen: SelectArtist }
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
    [routes.Message]: { screen: Message }
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

const YakStack = createStackNavigator(
  {
    [routes.YackList]: { screen: YakListScreen },
    [routes.YackNew]: { screen: YakNewScreen }
  },
  {
    initialRouteName: routes.YackList,
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
    [routes.Cards]: CardsSwitch,
    [routes.Profile]: ProfileStack,
    [routes.Matches]: MatchesStack,
    [routes.Yak]: YakStack
  },
  {
    initialRouteName: routes.Cards,
    animationEnabled: true,
    order: [routes.Profile, routes.Yak, routes.Cards, routes.Matches],

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

const AdminStack = createStackNavigator(
  {
    [routes.AdminHome]: { screen: AdminHomeScreen },
    [routes.AdminSettings]: { screen: AdminSettingsScreen },
    [routes.AdminClassmateList]: { screen: AdminClassmateListScreen },
    [routes.AdminClassmateOverview]: { screen: AdminClassmateOverviewScreen }
  },
  {
    initialRouteName: routes.AdminHome,
    ...removeHeader
  }
);

AdminStack.navigationOptions = () => {
  return {
    gesturesEnabled: false
  };
};

const createRootNavigator = () =>
  FluidNavigator(
    {
      [routes.AuthSwitch]: AuthSwitch,
      [routes.OnboardingStack]: OnboardingStack,
      [routes.MainSwitch]: MainContentSwitch,
      [routes.AppLoading]: { screen: AppLoading },
      [routes.Terminated]: { screen: TerminatedScreen },
      [routes.AdminStack]: AdminStack,
      [routes.Prelaunch]: PrelaunchStack
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
