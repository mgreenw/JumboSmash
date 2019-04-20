// @flow

import {
  UNAUTHORIZED,
  NETWORK_REQUEST_FAILED,
  BIRTHDAY_UNDER_18,
  TERMINATED
} from 'mobile/api/sharedResponseCodes';
import Sentry from 'sentry-expo';

export type Unauthorized_Action = {
  type: 'UNAUTHORIZED',
  payload: {},
  meta: {}
};

export type ServerError_Action = {
  type: 'SERVER_ERROR',
  payload: {},
  meta: {}
};

export type NetworkError_Action = {
  type: 'NETWORK_ERROR',
  payload: {},
  meta: {}
};

export type Terminated_Action = {
  type: 'TERMINATED',
  payload: {
    isUnder18: boolean
  },
  meta: {}
};

// eslint-disable-next-line
export function apiErrorHandler(
  reject: empty
):
  | Unauthorized_Action
  | ServerError_Action
  | NetworkError_Action
  | Terminated_Action {
  if (reject === NETWORK_REQUEST_FAILED) {
    return {
      type: 'NETWORK_ERROR',
      payload: {},
      meta: {}
    };
  }

  if (reject === UNAUTHORIZED) {
    return {
      type: 'UNAUTHORIZED',
      payload: {},
      meta: {}
    };
  }

  if (reject === TERMINATED || reject === BIRTHDAY_UNDER_18) {
    return {
      type: 'TERMINATED',
      payload: { isUnder18: reject === BIRTHDAY_UNDER_18 },
      meta: {}
    };
  }

  // All other errors we should log!
  Sentry.captureException(new Error(JSON.stringify(reject)));

  // Just throw everything else as a Server Error for the user.
  return {
    type: 'SERVER_ERROR'
  };
}
