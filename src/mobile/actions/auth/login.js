// @flow
import type { Dispatch } from "redux";
import { AsyncStorage } from "react-native";

export const LOGIN_INITIATED = "LOGIN_INITIATED";
export const LOGIN_COMPLETED = "LOGIN_COMPLETED";

function loginInitiate() {
  return {
    type: LOGIN_INITIATED
  };
}

function loginComplete(utln: string, token: string) {
  return {
    type: LOGIN_COMPLETED,
    utln: utln,
    token: token
  };
}

// TODO: consider error handling on the multiSet.
export function login(utln: string, token: string) {
  return function(dispatch: Dispatch) {
    dispatch(loginInitiate());
    setTimeout(() => {
      AsyncStorage.multiSet([["utln", utln], ["token", token]]).then(errors => {
        dispatch(loginComplete(utln, token));
      });
    }, 2000);
  };
}
