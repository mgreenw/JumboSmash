// @flow
import { StyleSheet } from "react-native";

// If you need to just test out a new page, this is very helpful
// to get a standardized page up and running.
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
    height: 40,
    backgroundColor: "rgba(255, 98, 98, 0.9)",
    borderRadius: 21
  }
});
