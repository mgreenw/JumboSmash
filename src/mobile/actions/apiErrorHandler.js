// @flow

import {
  UNAUTHORIZED,
  NETWORK_REQUEST_FAILED
} from 'mobile/api/sharedResponseCodes';
import Sentry from 'sentry-expo';

export type Unauthorized_Action = {
  type: 'UNAUTHORIZED'
};

export type ServerError_Action = {
  type: 'SERVER_ERROR'
};

export type NetworkError_Action = {
  type: 'NETWORK_ERROR'
};

// eslint-disable-next-line
export function apiErrorHandler(
  reject: empty
): Unauthorized_Action | ServerError_Action | NetworkError_Action {
  if (reject === NETWORK_REQUEST_FAILED) {
    return {
      type: 'NETWORK_ERROR'
    };
  }

  if (reject === UNAUTHORIZED) {
    return {
      type: 'UNAUTHORIZED'
    };
  }

  // All other errors we should log!
  Sentry.captureException(new Error(JSON.stringify(reject)));

  // Just throw everything else as a Server Error for the user.
  return {
    type: 'SERVER_ERROR'
  };
}
