// @flow

import { StyleSheet } from "react-native";

// Arthur Styles is our set of standardized styles.
const AquaMarine = "#38c7cc";
const Black = "#000000";
const BlueyGrey = "#8f99a1";
const Grapefruit = "#ff6262";
const Grey80 = "#cccccc";
const Grey85 = "#d9d9d9";
const Ice = "#f0f5f4";
const IceBlue = "#f0f3f5";
const Offblack = "#363535";
const SunYellow = "#fbcc23";
const White = "#ffffff";

export const Colors = {
  AquaMarine,
  Black,
  BlueyGrey,
  Grapefruit,
  Grey80,
  Grey85,
  Ice,
  IceBlue,
  Offblack,
  SunYellow,
  White
};

const buttonBase = {
  height: 40,
  borderRadius: 20,
  width: "100%"
};

const buttonTitleBase = {
  paddingLeft: 30,
  paddingRight: 30
};

export const Arthur_Styles = StyleSheet.create({
  checkBoxContainer_checked: {
    width: "100%",
    borderRadius: 30,
    margin: 0,
    backgroundColor: AquaMarine
  },
  checkBoxContainer_unchecked: {
    width: "100%",
    borderRadius: 30,
    margin: 0,
    backgroundColor: IceBlue
  },
  checkBoxText_unchecked: {
    fontSize: 12,
    marginLeft: 2,
    color: Black
  },
  checkBoxText_checked: {
    fontSize: 12,
    marginLeft: 2,
    color: IceBlue
  },
  checkBoxWrapper: {
    flex: 1,
    backgroundColor: "red"
  },
  title: {
    color: Grapefruit,
    fontFamily: "vegan",
    fontSize: 45,
    padding: 15,
    textAlign: "center"
  },
  onboardingHeader: {
    fontSize: 24,
    textAlign: "center"
  },
  buttonPrimaryActive: {
    ...buttonBase,
    backgroundColor: Grapefruit
  },
  buttonTitlePrimaryActive: {
    ...buttonTitleBase,
    color: White
  },
  buttonPrimaryDisabled: {
    ...buttonBase,
    backgroundColor: Grey85
  },
  buttonTitlePrimaryDisabled: {
    ...buttonTitleBase,
    color: BlueyGrey
  },
  container: {
    backgroundColor: White,
    flex: 1
  }
});
