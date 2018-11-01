// @flow
import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from "react-navigation";

// Entry point; used to load from phone storage & determine route
import AuthLoading from "./AuthLoading_Screen";

// App Screens
import Profile from "./App/Profile/Profile_Screen";
import Settings from "./App/Profile/Settings_Screen";
import Swiping from "./App/Swiping/Swiping_Screen";
import Messaging from "./App/Messaging/Messaging_Screen";

// Auth Screens
import Splash from "./Auth/Splash_Screen";
import Verify from "./Auth/Verify_Screen";
import Not2019 from "./Auth/Not2019_Screen";

// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const SwipingStack = createStackNavigator(
  {
    Swiping: { screen: Swiping }
  },
  {
    initialRouteName: "Swiping"
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: { screen: Profile },
    Settings: { screen: Settings }
  },
  {
    initialRouteName: "Profile"
  }
);

const MessagingStack = createStackNavigator(
  {
    Messaging: { screen: Messaging }
  },
  {
    initialRouteName: "Messaging"
  }
);

// This is a switch because we are difining our own interface between
// the pages. (NOT tabs, but headerbar navigation!)
const AppSwitch = createSwitchNavigator(
  {
    Swiping: SwipingStack,
    Profile: ProfileStack,
    Messaging: MessagingStack
  },
  {
    initialRouteName: "Swiping"
  }
);

const AuthStack = createStackNavigator(
  {
    Splash: { screen: Splash },
    Verify: { screen: Verify },
    Not2019: { screen: Not2019}
  },
  {
    initialRouteName: "Not2019"
  }
);

export const createRootNavigator = () => {
  return createSwitchNavigator(
    {
      App: AppSwitch,
      Auth: AuthStack,
      AuthLoading: AuthLoading
    },
    {
      initialRouteName: "AuthLoading"
    }
  );
};
