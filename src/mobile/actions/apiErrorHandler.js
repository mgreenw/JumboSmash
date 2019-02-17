// @flow

import { UNAUTHORIZED, SERVER_ERROR } from 'mobile/api/sharedResponseCodes';
import DevTesting from 'mobile/utils/DevTesting';

export type Unauthorized_Action = {
  type: 'UNAUTHORIZED'
};

export type Error_Action = {
  type: 'SERVER_ERROR'
};

// eslint-disable-next-line
export function apiErrorHandler(
  reject: empty
): Unauthorized_Action | Error_Action {
  DevTesting.log('Api Error Handler: ', reject);
  if (reject.error.err === UNAUTHORIZED) {
    return {
      type: 'UNAUTHORIZED'
    };
  }
  if (
    reject.error.response !== undefined &&
    reject.error.response.status === SERVER_ERROR
  ) {
    return {
      type: 'SERVER_ERROR'
    };
  }
  throw reject;
}
