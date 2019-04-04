// @flow
/* eslint-disable */

import { StyleSheet } from 'react-native';
import { Colors as colors } from './colors';

// Keep synced with Zeplin export!
/*
NOTE: If this is updated, map all fontWeights as follow:

Thin, Hairline          	100
Extra Light, Ultra Light 	200
Light 	                  300
Normal, Regular 	        400
Medium                  	500
Semi Bold, Demi Bold    	600
Bold 	                    700
Extra Bold, Ultra Bold  	800 
Black, Heavy            	900

*/

const textStyles = StyleSheet.create({
  headline1Style: {
    fontFamily: 'AvenirNext_Regular',
    fontSize: 96,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  headline2Style: {
    fontFamily: 'AvenirNext_Regular',
    fontSize: 60,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  headline3Style: {
    fontFamily: 'AvenirNext_Regular',
    fontSize: 48,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  jumboSmashStyle: {
    fontFamily: 'VeganStyle',
    fontSize: 40,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    padding: 15,
    color: colors.Grapefruit
  },
  headline4Style: {
    fontFamily: 'AvenirNext_Regular',
    fontSize: 34,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  headline4StyleDemibold: {
    fontFamily: 'AvenirNext_DemiBold',
    fontSize: 30,
    // fontWeight: '600',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  headline4StyleSwiping: {
    fontFamily: 'AvenirNext_Regular',
    fontSize: 28,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.Black
  },
  headline5StyleDemibold: {
    fontFamily: 'AvenirNext_DemiBold',
    fontSize: 24,
    // fontWeight: '600',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  headline5Style: {
    fontFamily: 'AvenirNext_Regular',
    fontSize: 24,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  headline6Style: {
    fontFamily: 'AvenirNext_Regular',
    fontSize: 20,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  body1StyleSemibold: {
    fontFamily: 'SourceSansPro_DemiBold',
    fontSize: 18,
    // fontWeight: '600',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  body1Style: {
    fontFamily: 'SourceSansPro_Regular',
    fontSize: 18,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  subtitle1StyleSemibold: {
    fontFamily: 'SourceSansPro_DemiBold',
    fontSize: 16,
    // fontWeight: '600',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.AquaMarine
  },
  messageCountStyle: {
    fontFamily: 'SourceSansPro_Regular',
    fontSize: 16,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.White
  },
  subtitle1Style: {
    fontFamily: 'SourceSansPro_Regular',
    fontSize: 16,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  body2StyleBold: {
    fontFamily: 'SourceSansPro_Bold',
    fontSize: 14,
    // fontWeight: 'bold',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  buttonStyleSemibold: {
    fontFamily: 'SourceSansPro_DemiBold',
    fontSize: 14,
    // fontWeight: '600',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  body2Style: {
    fontFamily: 'SourceSansPro_Regular',
    fontSize: 14,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  subtitle2Style: {
    fontFamily: 'SourceSansPro_Regular',
    fontSize: 14,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  },
  captionStyle: {
    fontFamily: 'SourceSansPro_Regular',
    fontSize: 12,
    // fontWeight: 'normal',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.Black
  }
});

export { textStyles };
