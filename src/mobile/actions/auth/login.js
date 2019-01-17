// @flow
import type { Dispatch } from "redux";
import { AsyncStorage } from "react-native";
import DevTesting from "../../utils/DevTesting";
import verify from "mobile/api/auth/verify";

export type login_response = {
  statusCode: "SUCCESS" | "BAD_CODE" | "EXPIRED_CODE" | "NO_EMAIL_SENT",
  token?: string
};

export type LoginInitiated_Action = {
  type: "LOGIN_INITIATED"
};
export type LoginCompleted_Action = {
  type: "LOGIN_COMPLETED",
  response: login_response
};

function initiate(): LoginInitiated_Action {
  return {
    type: "LOGIN_INITIATED"
  };
}

function complete(response: login_response): LoginCompleted_Action {
  return {
    type: "LOGIN_COMPLETED",
    response
  };
}

// TODO: consider error handling on the multiSet.
export function login(utln: string, code: string) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());

    DevTesting.fakeLatency(() => {
      verify({ utln, code }).then(response => {
        const token = response.token;
        if (token) {
          AsyncStorage.multiSet([["token", token]]).then(errors => {
            dispatch(complete(response));
          });
        } else {
          dispatch(complete(response));
        }
      });
    });
  };
}
