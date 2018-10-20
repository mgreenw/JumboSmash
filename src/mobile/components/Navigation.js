// @flow
import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

// These are the screens we want to navigate between!
// Group screens together in file structure when appropriate!

import Foo from './SignedIn/FooScreen';
import Bar from './SignedIn/BarScreen';


// Auth Screens
import Splash from './SignedOut/Splash_Screen';
import Verify from './SignedOut/Verify_Screen';
import Verify_Not2019 from './SignedOut/Verify_Not2019_Screen';

// This file should just set up navigation, so all actual content is in /
// Define what views / tabs / stacks the navigator will use

const SignedIn = createBottomTabNavigator(
  {
    Foo : { screen: Foo },
    Bar : { screen: Bar },
  }
)

// this probably won't need to be a full stack
const SignedOut = createStackNavigator(
  {
    Splash: { screen: Splash },
    Verify: { screen: Verify },
    Verify_Not2019: { screen: Verify_Not2019 },
  },
  {
    initialRouteName: 'Splash',
  }
)

export const createRootNavigator = (loggedIn: boolean = false) => {
  return createSwitchNavigator(
    {
      SignedIn: SignedIn,
      SignedOut: SignedOut,
    },
    {
      initialRouteName: loggedIn ? 'SignedIn' : 'SignedOut',
    },
  );
}
