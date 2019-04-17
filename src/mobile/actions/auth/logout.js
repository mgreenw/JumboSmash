// @flow

import type { Dispatch } from 'mobile/reducers';
import { AsyncStorage } from 'react-native';
import logoutApi from 'mobile/api/auth/logout';
import Sentry from 'sentry-expo';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type LogoutInitiated_Action = {
  type: 'LOGOUT__INITIATED',
  payload: {},
  meta: {}
};
export type LogoutCompleted_Action = {
  type: 'LOGOUT__COMPLETED',
  payload: {},
  meta: {}
};

export type LogoutFailed_Action = {
  type: 'LOGOUT__FAILED',
  payload: {},
  meta: {}
};

function initiate(): LogoutInitiated_Action {
  return {
    type: 'LOGOUT__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(): LogoutCompleted_Action {
  return {
    type: 'LOGOUT__COMPLETED',
    payload: {},
    meta: {}
  };
}

function fail(): LogoutFailed_Action {
  return {
    type: 'LOGOUT__FAILED',
    payload: {},
    meta: {}
  };
}

// We log a user out by removing their token; there's no way to invalidate
// a token's session, so we just remove their access to that session.
// We don't care if a key didn't exist, as this will still be logged out.
export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  logoutApi()
    .then(() => {
      // If this fails it dosn't really matter because the token is wrong at this point anyways.
      AsyncStorage.multiRemove(['token'])
        .then(() => {
          dispatch(complete());
        })
        .catch(err => {
          Sentry.captureException(new Error(err));
          dispatch(complete());
        });
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
