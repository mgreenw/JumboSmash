// @flow
/* eslint-disable */

import DevTesting from 'mobile/utils/DevTesting';
import { timeout } from './timeout';
import { UNAUTHORIZED } from '../sharedResponseCodes';

type method = 'PATCH' | 'GET' | 'POST' | 'DELETE';
export function apiRequest(
  method: method,
  route: string,
  auth: ?string,
  request: ?Object,
): Promise<Object> {
  return timeout(
    30000,
    fetch(route, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth || 'NO_TOKEN',
      },
      body: request && JSON.stringify(request),
    }),
  )
    .then(response => response.json())
    .then(response => {
      if (response.status === UNAUTHORIZED) {
        throw UNAUTHORIZED;
      }
      return response;
    })
    .catch(err => {
      throw { err, route };
    });
}
