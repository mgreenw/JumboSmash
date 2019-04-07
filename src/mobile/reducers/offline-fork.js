// @flow

// We have dug ourselves into a deep and dangerous pit.
// Our lack of combine reducers has put us into a position
// where we can either:
// 1. refactor all our redux state logic to use nested state
// 2. hack around this.

// For the intrest of shipping a viable app, I've opted to hack this part.
// I'm not too worried as it's a REALLY small ammount of logic, mostly just constant handling.

import type { ReduxState } from './index';

export const CONNECTION_CHANGE = '@@network-connectivity/CONNECTION_CHANGE';

// From: https://github.com/rgommezz/react-native-offline/blob/master/src/redux/actionCreators.js
export type NetworkChange_Action = {
  type: '@@network-connectivity/CONNECTION_CHANGE',
  payload: boolean // isConnected
};

// From: https://github.com/rgommezz/react-native-offline/blob/master/src/redux/reducer.js
export function handleNetworkChange(
  state: ReduxState,
  isConnected: boolean
): ReduxState {
  return {
    ...state,
    network: {
      isConnected
    }
  };
}
