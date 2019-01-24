// @flow
import type { Dispatch } from "redux";
import { AsyncStorage } from "react-native";
import DevTesting from "../../utils/DevTesting";
import { apiErrorHandler } from "mobile/actions/apiErrorHandler";

export type LoadAuthCompleted_Action = {
  type: "LOAD_AUTH__COMPLETED",
  token: string
};
export type LoadAuthInitiated_Action = {
  type: "LOAD_AUTH__INITIATED"
};

function initiate(): LoadAuthInitiated_Action {
  return {
    type: "LOAD_AUTH__INITIATED"
  };
}

function complete(token: string): LoadAuthCompleted_Action {
  return {
    type: "LOAD_AUTH__COMPLETED",
    token: token
  };
}

export function loadAuth() {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      AsyncStorage.multiGet(["token"])
        .then(stores => {
          const token = stores[0][1];
          dispatch(complete(token));
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  };
}
