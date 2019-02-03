// @flow
import type { Dispatch, GetState } from "redux";
import { UNAUTHORIZED, SERVER_ERROR } from "mobile/api/sharedResponseCodes";
import DevTesting from "mobile/utils/DevTesting";

export type Unauthorized_Action = {
  type: "UNAUTHORIZED"
};

export type Error_Action = {
  type: "SERVER_ERROR"
};

export function apiErrorHandler(
  reject: empty
): Unauthorized_Action | Error_Action {
  DevTesting.log("Api Error Handler: ", reject);
  if (reject.error.err === UNAUTHORIZED) {
    return {
      type: "UNAUTHORIZED"
    };
  } else if (reject.error.response.status === SERVER_ERROR) {
    return {
      type: "SERVER_ERROR"
    };
  } else {
    throw reject;
  }
}
