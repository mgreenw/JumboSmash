// @flow

import type { Dispatch } from 'mobile/reducers';
import { AsyncStorage } from 'react-native';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

export type LoadAuthCompleted_Action = {
  type: 'LOAD_AUTH__COMPLETED',
  payload: { token: string },
  meta: {}
};
export type LoadAuthInitiated_Action = {
  type: 'LOAD_AUTH__INITIATED',
  payload: {},
  meta: {}
};

function initiate(): LoadAuthInitiated_Action {
  return {
    type: 'LOAD_AUTH__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(token: string): LoadAuthCompleted_Action {
  return {
    type: 'LOAD_AUTH__COMPLETED',
    payload: { token },
    meta: {}
  };
}

export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  DevTesting.fakeLatency(() => {
    AsyncStorage.multiGet(['token'])
      .then(stores => {
        const token = stores[0][1];
        dispatch(complete(token));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
