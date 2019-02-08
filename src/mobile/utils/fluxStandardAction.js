// https://github.com/redux-utilities/flux-standard-action
// @flow
/* eslint-disable */

import { isPlainObject, isString } from 'lodash';

export function isFSA(action: any) {
  return isPlainObject(action) && isString(action.type) && Object.keys(action).every(isValidKey);
}

export function isError(action: any) {
  return isFSA(action) && action.error === true;
}

function isValidKey(key) {
  return ['type', 'payload', 'error', 'meta'].indexOf(key) > -1;
}
