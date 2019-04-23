// @flow

import store from 'mobile/store';
import Sentry from 'sentry-expo';
import { timeout } from './timeout';
import {
  UNAUTHORIZED,
  TERMINATED,
  BIRTHDAY_UNDER_18,
  NETWORK_REQUEST_FAILED
} from '../sharedResponseCodes';

type Method = 'PATCH' | 'GET' | 'POST' | 'DELETE';

function constructHeaders(authorizationToken: ?string, adminPassword: ?string) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  const authHeaders = authorizationToken
    ? {
        ...baseHeaders,
        Authorization: authorizationToken
      }
    : baseHeaders;

  const passwordHeaders = adminPassword
    ? {
        ...authHeaders,
        'Admin-Authorization': adminPassword
      }
    : authHeaders;

  return passwordHeaders;
}

export default function apiRequest(
  method: Method,
  route: string,
  request: ?Object,
  adminPassword: ?string
): Promise<Object> {
  const { token = 'NO_TOKEN' } = store.getState();

  const headers = constructHeaders(token, adminPassword);

  return timeout(
    30000,
    // eslint-disable-next-line no-undef
    fetch(route, {
      method,
      headers,
      body: request && JSON.stringify(request)
    })
  )
    .then(response => response.json())
    .then(response => {
      if (response.status === UNAUTHORIZED) {
        throw UNAUTHORIZED;
      }
      if (response.status === TERMINATED) {
        if (response.data && response.data.reason === BIRTHDAY_UNDER_18) {
          throw BIRTHDAY_UNDER_18;
        }
        throw TERMINATED;
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
