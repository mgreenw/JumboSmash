// @flow

import { StyleSheet } from "react-native";

// Arthur Styles is our set of standardized styles.
const IceBlue = "#f0f3f5";
const Black = "#363535";
const AquaMarine = "#38c7cc";

export const Colors = {
  IceBlue,
  Black,
  AquaMarine
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
  }
});
