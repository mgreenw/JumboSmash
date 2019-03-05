// @flow

import {
  UNAUTHORIZED,
  SERVER_ERROR,
  NETWORK_REQUEST_FAILED
} from 'mobile/api/sharedResponseCodes';
import DevTesting from 'mobile/utils/DevTesting';

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
  if (reject.error.err === UNAUTHORIZED) {
    return {
      type: 'UNAUTHORIZED'
    };
  }

  if (reject.error === NETWORK_REQUEST_FAILED) {
    return {
      type: 'NETWORK_ERROR'
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
