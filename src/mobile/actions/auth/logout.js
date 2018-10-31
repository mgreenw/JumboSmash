// @flow
import type { Dispatch } from "redux";

// Logout just tells the reducer to remove the token from the async store.
export const LOGOUT = "LOGOUT";
export const logout = () => {
  return {
    type: LOGOUT
  };
};
