// @flow

import { createStore, compose, applyMiddleware } from 'redux';
import type { Store as ReduxStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'mobile/reduxMiddleware/loggerMiddleware';
import tokenMiddleware from 'mobile/reduxMiddleware/tokenMiddleware';
import errorMiddleware from 'mobile/reduxMiddleware/errorMiddleware';
import badgesMiddleware from 'mobile/reduxMiddleware/badgesMiddleware';
import rootReducer from 'mobile/reducers';
import Socket from 'mobile/utils/Socket';
import type { ReduxState, Action } from 'mobile/reducers';

const enchancers = compose(
  applyMiddleware(thunkMiddleware),
  applyMiddleware(errorMiddleware),
  applyMiddleware(tokenMiddleware),
  applyMiddleware(loggerMiddleware),
  applyMiddleware(badgesMiddleware)
);

export type Store = ReduxStore<ReduxState, Action>;

function configureStore(): Store {
  const store: Store = createStore(rootReducer, enchancers);

  // On update of the token, reconnect the socket using the new token
  let { token: currToken } = store.getState();
  store.subscribe(() => {
    const { token: newToken } = store.getState();
    if (newToken && newToken !== currToken) {
      Socket.connect(newToken);
      currToken = newToken;
    }
  });
  return store;
}

const store = configureStore();
export default store;
