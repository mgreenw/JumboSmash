// @flow
import type { Dispatch } from "redux";
import { AsyncStorage } from "react-native";
import DevTesting from "../../utils/DevTesting";
import { apiErrorHandler } from "mobile/actions/apiErrorHandler";

export type LogoutInitiated_Action = {
  type: "LOGOUT_INITIATED"
};
export type LogoutCompleted_Action = {
  type: "LOGOUT_COMPLETED"
};

function initiate(): LogoutInitiated_Action {
  return {
    type: "LOGOUT_INITIATED"
  };
}

function complete(): LogoutCompleted_Action {
  return {
    type: "LOGOUT_COMPLETED"
  };
}

// We log a user out by removing their token; there's no way to invalidate
// a token's session, so we just remove their access to that session.
// We don't care if a key didn't exist, as this will still be logged out.
export function logout() {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      AsyncStorage.multiRemove(["token"]).then(stores => {
        dispatch(complete());
      });
    });
  };
}
