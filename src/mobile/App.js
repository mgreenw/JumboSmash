// @flow

import React from 'react';
import { Provider } from 'react-redux';

import { createAppContainer } from '@react-navigation/native';
import NavigationService from 'mobile/components/navigation/NavigationService';
import createRootNavigator from 'mobile/components/navigation/Navigation';
import store from './store';
import MasterPopup from './components/MasterPopup';
import BottomToast from './components/shared/toast/BottomToast';

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
        <MasterPopup />
        <BottomToast />
      </Provider>
    );
  }
}
