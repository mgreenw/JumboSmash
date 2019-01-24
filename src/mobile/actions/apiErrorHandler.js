// @flow
import type { Dispatch, GetState } from "redux";
import { UNAUTHORIZED } from "mobile/api/sharedResponseCodes";
import DevTesting from "mobile/utils/DevTesting";

export type Unauthorized_Action = {
  type: "UNAUTHORIZED"
};

export function apiErrorHandler(reject: empty): Unauthorized_Action {
  DevTesting.log("Api Error Handler: ", reject);
  if (reject.error === UNAUTHORIZED) {
    return {
      type: "UNAUTHORIZED"
    };
  } else {
    throw reject;
  }
}
