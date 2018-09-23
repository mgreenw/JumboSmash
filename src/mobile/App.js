import React from 'react';
import {  createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

// These are the screens we want to navigate between!
// Group screens together in file structure when appropriate!

import FooScreen from './pages/FooScreen';
import BarScreen from './pages/BarScreen'

import LoginScreen from './pages/LoginStack/LoginScreen'
import SplashScreen from './pages/LoginStack/SplashScreen'
import SignupScreen from './pages/LoginStack/SignupScreen'

// This file should just set up navigation, so all actual content is in pages/
// Define what views / tabs / stacks the navigator will use

const _AppTabs = createBottomTabNavigator(
  {
    Foo : { screen: FooScreen },
    Bar : { screen: BarScreen },
  }
)

// this probably won't need to be a full stack
const _LoginStack = createStackNavigator(
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
    LoginSwitch: _LoginStack,
  },
  {
    initialRouteName: 'LoginSwitch',
  },

)
