// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { createAppContainer } from '@react-navigation/native';
import NavigationService from 'mobile/components/navigation/NavigationService';
import createRootNavigator from 'mobile/components/navigation/Navigation';
import Sentry from 'sentry-expo';
import { ReduxNetworkProvider } from 'react-native-offline';
import { Notifications } from 'expo';
import { AppState, YellowBox } from 'react-native';

import notificationHandler from 'mobile/utils/NotificationHandler';
import foregroundHandler from 'mobile/utils/ForegroundHandler';
import store from './store';
import MasterPopup from './components/MasterPopup';
import BottomToast from './components/shared/toast/BottomToast';
import TopToast from './components/shared/toast/TopToast';
import OfflinePopup from './components/OfflinePopup';

const TopLevelNavigator = createRootNavigator();
const AppContainer = createAppContainer(TopLevelNavigator);

type Props = {};
type State = {
  appState: any
};

YellowBox.ignoreWarnings(['Require cycle:']);

// Enable if you want to test sentry locally!
Sentry.enableInExpoDevelopment = false;

Sentry.config(
  'https://ecc5a708ed57466a9ed0dfb92059f98a@sentry.io/1415487'
).install();

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    };

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(
      notificationHandler
    );
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  /**
   * BoilerPlate for determining if app is open from:
   * https://docs.expo.io/versions/latest/react-native/appstate/
   */
  _handleAppStateChange = (nextAppState: any) => {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      foregroundHandler();
    }
    this.setState({ appState: nextAppState });
  };

  _notificationSubscription: any;

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
