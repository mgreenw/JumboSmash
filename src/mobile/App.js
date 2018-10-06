// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Navigator from './components/Navigation';
import rootReducer from './reducers'

const store = createStore( rootReducer );

type Props= {}

export default class App extends React.Component<Props> {

  render() {
    return (
      <Provider store={ store }>
        <Navigator />
      </Provider>
    );
  }
}
