// @flow
/* eslint-disable */

import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "./config.json";

export default createIconSetFromFontello(
  fontelloConfig,
  "gemicons",
  "gemicons.ttf"
);

// add more from fontello as needed. See "demo.html" of the fontello
// config if you need to figure out the names.
export type IconName =
  | "user"
  | "message"
  | "cards"
  | "back"
  | "life-ring"
  | "gear"
  | "check"
  | "delete-filled"
  | "heart-filled";
