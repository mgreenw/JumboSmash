// @flow
import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "./config.json";

// https://github.com/oblador/react-native-vector-icons
// Takes our icons, which are a font, a config file, and maps them to an
// object we can import as an IconSet, which we can then use as icons.
export default createIconSetFromFontello(
  fontelloConfig,
  "gemicons",
  "gemicons.ttf"
);
