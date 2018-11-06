// @flow
import type { Dispatch } from "redux";
import { AsyncStorage } from "react-native";
import DevTesting from "../../utils/DevTesting";

export const LOGOUT_INITIATED = "LOGOUT_INITIATED";
export const LOGOUT_COMPLETED = "LOGOUT_COMPLETED";

function initiate() {
  return {
    type: LOGOUT_INITIATED
  };
}

function complete() {
  return {
    type: LOGOUT_COMPLETED
  };
}

// We log a user out by removing their token; there's no way to invalidate
// a token's session, so we just remove their access to that session.
// We don't care if a key didn't exist, as this will still be logged out.
export function logout() {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      AsyncStorage.multiRemove(["utln", "token"]).then(stores => {
        dispatch(complete());
      });
    });
  };
}
