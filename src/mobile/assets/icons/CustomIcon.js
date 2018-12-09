// @flow
import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "./config.json";
export default createIconSetFromFontello(
  fontelloConfig,
  "gemicons",
  "gemicons.ttf"
);
