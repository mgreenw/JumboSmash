// @flow

import type { Action, ReduxState } from 'mobile/reducers/index';
import { Image } from 'react-native';

export default (store: any) => (next: any) => (action: Action) => {
  // Get the state before and after the action was performed
  // const prevState: ReduxState = store.getState();
  // const prevClient = prevState.client;

  next(action);

  const nextState: ReduxState = store.getState();
  const nextClient = nextState.client;
  console.log('Image middleware');

  if (nextClient !== null && nextClient !== undefined) {
    // let prevPhotoIds = [];
    // if (prevClient !== null && prevClient !== undefined) {
    //   prevPhotoIds = prevClient.profile.photoIds;
    // }
    const nextPhotoIds = nextClient.profile.photoIds;
    const cacheResults = Image.queryCache(nextPhotoIds);
    console.log(cacheResults);
  }
};
