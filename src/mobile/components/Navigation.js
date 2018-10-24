// @flow
import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

// Entry point; used to load from phone storage & determine route
import AuthLoading from './AuthLoading_Screen'

// App Screens
import Foo from './App/FooScreen';
import Bar from './App/BarScreen';

// Auth Screens
import Splash from './Auth/Splash_Screen';
import Verify from './Auth/Verify_Screen';

// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const AppTabs = createBottomTabNavigator(
  {
    Foo : { screen: Foo },
    Bar : { screen: Bar },
  }
)

// this probably won't need to be a full stack
const AuthStack = createStackNavigator(
  {
    Splash: { screen: Splash },
    Verify: { screen: Verify },
  },
  {
    initialRouteName: 'Splash',
  }
)

export const createRootNavigator = () => {
  return createSwitchNavigator(
    {
      App: AppTabs,
      Auth: AuthStack,
      AuthLoading: AuthLoading,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  );
}
