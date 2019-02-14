// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createAppContainer } from '@react-navigation/native';
import { loggerMiddleware } from 'mobile/reduxMiddleware/loggerMiddleware';
import { tokenMiddleware } from 'mobile/reduxMiddleware/tokenMiddleware';
import { errorMiddleware } from 'mobile/reduxMiddleware/errorMiddleware';
import imageCacheMiddleware from 'mobile/reduxMiddleware/imageCacheMiddleware';

import NavigationService from 'mobile/NavigationService';
import rootReducer from 'mobile/reducers';
import { createRootNavigator } from 'mobile/components/Navigation';

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunkMiddleware),
    applyMiddleware(errorMiddleware),
    applyMiddleware(tokenMiddleware),
    applyMiddleware(loggerMiddleware),
    // applyMiddleware(imageCacheMiddleware),
  ),
);
const TopLevelNavigator = createRootNavigator();
const AppContainer = createAppContainer(TopLevelNavigator);

type Props = {};
type State = {};

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  /* eslint-disable */
  render() {
    return (
      <Provider store={store}>
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}
