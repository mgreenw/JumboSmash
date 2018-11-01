// @flow
import type { Dispatch } from "redux";

// saves a user's login token to the redux store
// assumes the token is valid.
export const LOGIN_WITH_NEW_TOKEN = "LOGIN_WITH_NEW_TOKEN";
export const login = (utln: string, token: string) => ({
  type: LOGIN_WITH_NEW_TOKEN,
  utln: utln,
  token: token
});
