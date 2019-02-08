// @flow
/* eslint-disable */

import type { Action } from 'mobile/reducers/index';
import NavigationService from 'mobile/NavigationService';
import { SPLASH_ROUTE } from 'mobile/components/Navigation';

const tokenMiddleware = (store: any) => (next: any) => (action: Action) => {
  let result = next(action);
  const { type } = action;
  if (type === 'UNAUTHORIZED') {
    NavigationService.reset(type);
  }
  return result;
};

export { tokenMiddleware };
