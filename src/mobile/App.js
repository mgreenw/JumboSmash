// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createRootNavigator } from './components/Navigation';
import rootReducer from './reducers'

const store = createStore( rootReducer );

type Props = {}
type State = {
  signedIn: boolean,
}

const DefaultState = {
  signedIn: false,
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = DefaultState;
  }

  render() {
    // TODO: render loading screen
    if (!true) {
      return null;
    }

    const Navigator = createRootNavigator(false);

    return (
      <Provider store={ store }>
        <Navigator />
      </Provider>
    );
  }
}
