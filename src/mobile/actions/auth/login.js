// @flow
import type { Dispatch } from "redux";
import { AsyncStorage } from "react-native";
import DevTesting from "../../utils/DevTesting";

export const LOGIN_INITIATED = "LOGIN_INITIATED";
export const LOGIN_COMPLETED = "LOGIN_COMPLETED";

function initiate() {
  return {
    type: LOGIN_INITIATED
  };
}

function complete(utln: string, token: string) {
  return {
    type: LOGIN_COMPLETED,
    utln: utln,
    token: token
  };
}

// TODO: consider error handling on the multiSet.
export function login(utln: string, token: string) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      AsyncStorage.multiSet([["utln", utln], ["token", token]]).then(errors => {
        dispatch(complete(utln, token));
      });
    });
  };
}
