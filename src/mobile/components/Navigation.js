// @flow
import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

// These are the screens we want to navigate between!
// Group screens together in file structure when appropriate!

import FooScreen from './SignedIn/FooScreen';
import BarScreen from './SignedIn/BarScreen';

import LoginScreen from './SignedOut/LoginScreen';
import SplashScreen from './SignedOut/SplashScreen';
import SignupScreen from './SignedOut/SignupScreen';

// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const _AppTabs = createBottomTabNavigator(
  {
    Foo : { screen: FooScreen },
    Bar : { screen: BarScreen },
  }
)

// this probably won't need to be a full stack
const _SignedOut = createStackNavigator(
  {
    Splash: { screen: SplashScreen },
    Login: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
  },
  {
    initialRouteName: 'Splash',
  }
)

export default createSwitchNavigator(
  {
    AppSwitch: _AppTabs,
    LoginSwitch: _SignedOut,
  },
  {
    initialRouteName: 'LoginSwitch',
  },
)
