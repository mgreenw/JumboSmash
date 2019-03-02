// @flow

import DevTesting from 'mobile/utils/DevTesting';
import type { Action } from 'mobile/reducers/index';

// middleware logger for actions
const loggerMiddleware = () => (next: any) => (action: Action) => {
  DevTesting.log('Will Dispatch: ', action.type);

  // Call the next dispatch method in the middleware chain.
  return next(action);
};

export default loggerMiddleware;
