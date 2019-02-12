// @flow

import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { loggerMiddleware } from 'mobile/reduxMiddleware/loggerMiddleware';
import { tokenMiddleware } from 'mobile/reduxMiddleware/tokenMiddleware';
import { errorMiddleware } from 'mobile/reduxMiddleware/errorMiddleware';
import rootReducer from 'mobile/reducers';
import Socket from 'mobile/utils/Socket';

/* eslint-disable import/prefer-default-export */
export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunkMiddleware),
    applyMiddleware(errorMiddleware),
    applyMiddleware(tokenMiddleware),
    applyMiddleware(loggerMiddleware),
  ),
);
/* eslint-enable */

// On update of the token, reconnect the socket using the new token
let { token: currToken } = store.getState();
store.subscribe(() => {
  const { token: newToken } = store.getState();
  if (newToken && newToken !== currToken) {
    Socket.connect(newToken);
  }
  currToken = newToken;
});
