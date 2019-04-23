// @flow

import { StyleSheet } from 'react-native';
import { isAndroid } from 'mobile/utils/Platform';
import { Colors } from './colors';

// Arthur Styles is our set of standardized styles.
const buttonBase = {
  height: 40,
  borderRadius: 20
};

const buttonTitleBase = {
  paddingLeft: 20,
  paddingRight: 20
};

const swipeButtonBase = {
  position: 'absolute',
  bottom: 20
};

export const Arthur_Styles = StyleSheet.create({
  checkBoxContainer_checked: {
    width: '100%',
    borderRadius: 30,
    margin: 0,
    backgroundColor: Colors.AquaMarine
  },
  checkBoxContainer_unchecked: {
    width: '100%',
    borderRadius: 30,
    margin: 0,
    backgroundColor: Colors.IceBlue
  },
  checkBoxText_unchecked: {
    fontSize: 12,
    marginLeft: 2,
    color: Colors.Black
  },
  checkBoxText_checked: {
    fontSize: 12,
    marginLeft: 2,
    color: Colors.IceBlue
  },
  checkBoxWrapper: {
    flex: 1,
    backgroundColor: 'red'
  },
  title: {
    color: Colors.Grapefruit,
    fontFamily: 'VeganStyle',
    fontSize: 45,
    padding: 15,
    width: isAndroid() ? '100%' : null,
    textAlign: 'center'
  },
  onboardingHeader: {
    fontSize: 24,
    textAlign: 'center'
  },
  buttonPrimaryActive: {
    ...buttonBase,
    backgroundColor: Colors.Grapefruit
  },
  buttonTitlePrimaryActive: {
    ...buttonTitleBase,
    color: Colors.White
  },
  buttonPrimaryDisabled: {
    ...buttonBase,
    backgroundColor: Colors.Grey85
  },
  buttonTitlePrimaryDisabled: {
    ...buttonTitleBase,
    color: Colors.BlueyGrey
  },
  buttonSecondaryActive: {
    ...buttonBase,
    backgroundColor: Colors.White,
    borderColor: Colors.Grapefruit,
    borderWidth: 1
  },
  buttonTitleSecondaryActive: {
    ...buttonTitleBase,
    color: Colors.Grapefruit
  },
  buttonSecondaryDisabled: {
    ...buttonBase,
    backgroundColor: Colors.White,
    borderColor: Colors.Grey85,
    borderWidth: 1
  },
  buttonTitleSecondaryDisabled: {
    ...buttonTitleBase,
    color: Colors.BlueyGrey
  },
  container: {
    backgroundColor: Colors.White,
    flex: 1
  },
  waves: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%'
  },
  swipeButton_dislike: {
    ...swipeButtonBase,
    left: 100
  },
  swipeButton_like: {
    ...swipeButtonBase,
    right: 100
  }
});
