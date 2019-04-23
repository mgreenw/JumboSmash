// @flow

import type { Action, ReduxState } from 'mobile/reducers/index';
import { Notifications } from 'expo';

async function updageBadgesIos(numBadges: number): Promise<void> {
  return Notifications.setBadgeNumberAsync(0).then(() => {
    Notifications.setBadgeNumberAsync(numBadges);
  });
}

const badgesMiddleware = (store: any) => (next: any) => (action: Action) => {
  // NOTE: this store is less general of a type than store usually is.
  // It has getState, but not some other functions, so we any type it here, and instead type the return.
  const { numBadges: prevNumBadges }: ReduxState = store.getState();
  const result = next(action);
  const { numBadges: newNumBadges }: ReduxState = store.getState();
  if (prevNumBadges !== newNumBadges && newNumBadges !== null) {
    updageBadgesIos(newNumBadges);
  }
  return result;
};

export default badgesMiddleware;
