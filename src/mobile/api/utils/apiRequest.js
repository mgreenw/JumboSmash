// @flow

import store from 'mobile/store';
import Sentry from 'sentry-expo';
import { timeout } from './timeout';
import { UNAUTHORIZED, NETWORK_REQUEST_FAILED } from '../sharedResponseCodes';

type Method = 'PATCH' | 'GET' | 'POST' | 'DELETE';
export default function apiRequest(
  method: Method,
  route: string,
  request: ?Object
): Promise<Object> {
  const { token } = store.getState();
  const auth = token || 'NO_TOKEN';
  return timeout(
    30000,
    // eslint-disable-next-line no-undef
    fetch(route, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth
      },
      body: request && JSON.stringify(request)
    })
  )
    .then(response => response.json())
    .then(response => {
      if (response.status === UNAUTHORIZED) {
        throw UNAUTHORIZED;
      }
      return response;
    })
    .catch(err => {
      if (err instanceof TypeError) {
        if (err.message === 'Network request failed') {
          throw NETWORK_REQUEST_FAILED;
        }
      }
      // Gotta propogate that up!
      if (err === UNAUTHORIZED) {
        throw err;
      }
      Sentry.captureException(err);
      throw err;
    });
}
