// @flow

// Self contained API file for validateToken

import { timeout } from './../utils/timeout';
import {
  AUTHORIZED,
  UNAUTHORIZED
} from '../sharedResponseCodes';

// TODO: We're not looking for server or timeout errors here.
// For now, consider ANYTHING that causes an error as a token invalidation.
// Eventually, we DON'T want this behavoir, especially for network timeouts.
// For now, this is a fine solution as we're kinda punting server error + client
// network error handling.

type validateTokenResponse__VALID = {
  status: string,
}

type verifyTokenResponse__INVALID = {
  status: string,
}

type request = {
  utln: string,
  token: string,
}

export default function checkTokenValid(
  request: request,
  callback__AUTHORIZED: (response: validateTokenResponse__VALID, request: request) => void,
  callback__UNAUTHORIZED: (response: verifyTokenResponse__INVALID, request: request) => void,
  callback__ERROR: (response: any, request: request) => void,
){
  return timeout(30000,
    fetch('http://127.0.0.1:3000/api/auth/check-token-valid/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
  )
  .then(response => response.json())
  .then(response => {
    // We use this to ASSERT what the type of the response is.
    switch (response.status) {
      case AUTHORIZED:
        callback__AUTHORIZED(response, request);
        break;
      case UNAUTHORIZED:
        callback__UNAUTHORIZED(response, request);
        break;
      default:
        callback__ERROR(response, request);
      }
    })
  .catch(error => {
    callback__ERROR(error, request)
  });
}
