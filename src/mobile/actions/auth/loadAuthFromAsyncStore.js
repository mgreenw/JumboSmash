// @flow
import type { Dispatch } from "redux";

// Gets auth (token, utln) from async store, saves to redux state.
export const LOAD_AUTH_FROM_ASYNC_STORE = "LOAD_AUTH_FROM_ASYNC_STORE";
export const loadAuthFromAsyncStore = () => ({
  type: LOAD_AUTH_FROM_ASYNC_STORE
});
