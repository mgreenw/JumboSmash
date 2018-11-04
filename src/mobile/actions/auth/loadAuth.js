// @flow
import type { Dispatch } from "redux";
import { AsyncStorage } from "react-native";

// Gets auth (token, utln) from async store, saves to redux state.
export const LOAD_AUTH__INITIATED = "LOAD_AUTH__INITIATED";
export const LOAD_AUTH__COMPLETED = "LOAD_AUTH__COMPLETED";

function loadAuth_initiate() {
  return {
    type: LOAD_AUTH__INITIATED
  };
}

function loadAuth_complete(utln: string, token: string) {
  return {
    type: LOAD_AUTH__COMPLETED,
    utln: utln,
    token: token
  };
}

export function loadAuth() {
  return function(dispatch: Dispatch) {
    dispatch(loadAuth_initiate());
    setTimeout(() => {
      AsyncStorage.multiGet(["utln", "token"]).then(stores => {
        const utln = stores[0][1];
        const token = stores[1][1];
        dispatch(loadAuth_complete(utln, token));
      });
    }, 2000);
  };
}
