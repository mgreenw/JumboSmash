// @flow
/* eslint-disable */

import DevTesting from 'mobile/utils/DevTesting';

// middleware logger for actions
export function loggerMiddleware({ getState }: any) {
  return (next: any) => (action: any) => {
    DevTesting.log('Will Dispatch: ', action.type);

    // Call the next dispatch method in the middleware chain.
    return next(action);
  };
}
