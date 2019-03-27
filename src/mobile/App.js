// @flow

import React from 'react';
import { Provider } from 'react-redux';

import { createAppContainer } from '@react-navigation/native';
import NavigationService from 'mobile/components/navigation/NavigationService';
import createRootNavigator from 'mobile/components/navigation/Navigation';
import Sentry from 'sentry-expo';
import { ReduxNetworkProvider } from 'react-native-offline';
import store from './store';
import MasterPopup from './components/MasterPopup';
import BottomToast from './components/shared/toast/BottomToast';
import TopToast from './components/shared/toast/TopToast';
import OfflinePopup from './components/OfflinePopup';

const TopLevelNavigator = createRootNavigator();
const AppContainer = createAppContainer(TopLevelNavigator);

type Props = {};
type State = {};

// Enable if you want to test sentry locally!
Sentry.enableInExpoDevelopment = false;

Sentry.config(
  'https://ecc5a708ed57466a9ed0dfb92059f98a@sentry.io/1415487'
).install();

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  /* eslint-disable */
  render() {
    return (
      <Provider store={store}>
        <ReduxNetworkProvider>
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
          <MasterPopup />
          <BottomToast />
          <TopToast />
          <OfflinePopup />
        </ReduxNetworkProvider>
      </Provider>
    );
  }
}
