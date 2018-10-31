// @flow
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 30,
    alignSelf: "stretch"
  },
  title: {
    fontSize: 50,
    letterSpacing: 3,
    textAlign: "center"
  },
  button: {
    height: 40
  },
  inputWrapperStyle: {
    height: 60,
    width: "100%"
  },
  inputWrapperStyleWithError: {
    height: 80,
    width: "100%"
  },
  inputContainerStyle: {
    height: 40,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5
  },
  labelStyle: {
    height: 20
  },
  helpTextContainer: {
    paddingTop: 5,
    paddingBottom: 10
  }
});
