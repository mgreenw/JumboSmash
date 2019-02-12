// @flow

import React from 'react';
import { Provider } from 'react-redux';

import { createAppContainer } from '@react-navigation/native';
import NavigationService from 'mobile/NavigationService';
import { createRootNavigator } from 'mobile/components/Navigation';
import { store } from './store';

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
