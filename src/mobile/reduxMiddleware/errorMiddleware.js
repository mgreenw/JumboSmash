// @flow
/* eslint-disable */

import type { Action } from 'mobile/reducers/index';

const errorMiddleware = (store: any) => (next: any) => (action: Action) => {
  const result = next(action);
  const { type } = action;
  if (type === 'SERVER_ERROR') {
    throw new Error(
      "Sorry, server error occured. Later, we'll catch these nicely. For now, restart the app!",
    );
  }
  return result;
};

export { errorMiddleware };
