// @flow

import type { Action } from 'mobile/reducers/index';
import NavigationService from 'mobile/components/navigation/NavigationService';

const tokenMiddleware = () => (next: any) => (action: Action) => {
  const result = next(action);
  const { type } = action;
  if (type === 'UNAUTHORIZED') {
    NavigationService.reset(type);
  }
  return result;
};

export default tokenMiddleware;
