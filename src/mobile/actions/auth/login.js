// @flow

import type { Dispatch } from 'mobile/reducers';
import { AsyncStorage } from 'react-native';
import verifyApi from 'mobile/api/auth/verify';
import { Permissions } from 'expo';
import Sentry from 'sentry-expo';
import requestNotificationToken from 'mobile/utils/requestNotificationToken';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type Login_Response = {
  statusCode: 'SUCCESS' | 'BAD_CODE' | 'EXPIRED_CODE' | 'NO_EMAIL_SENT',
  token?: string
};

export type LoginInitiated_Action = {
  type: 'LOGIN_INITIATED',
  payload: {},
  meta: {}
};
export type LoginCompleted_Action = {
  type: 'LOGIN_COMPLETED',
  payload: {
    response: Login_Response
  },
  meta: {}
};

export type LoginFailed_Action = {
  type: 'LOGIN_FAILED',
  payload: {},
  meta: {}
};

function initiate(): LoginInitiated_Action {
  return {
    type: 'LOGIN_INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(response: Login_Response): LoginCompleted_Action {
  return {
    type: 'LOGIN_COMPLETED',
    payload: {
      response
    },
    meta: {}
  };
}

function fail(): LoginFailed_Action {
  return {
    type: 'LOGIN_FAILED',
    payload: {},
    meta: {}
  };
}

const verify = (
  dispatch: Dispatch,
  utln: string,
  code: string,
  expoPushToken?: string
) => {
  verifyApi({ utln, code, expoPushToken })
    .then(response => {
      const token = response.token;
      // save valid tokens
      if (token) {
        AsyncStorage.multiSet([['token', token]]).then(errors => {
          if (errors) {
<<<<<<< HEAD
            Sentry.captureException(new Error(errors));
=======
            const [error] = errors;
            Sentry.captureException(error);
>>>>>>> b0621a002eaef7c5f4ae8dc4b7de5e60a9e5b0c4
          }
          dispatch(complete(response));
        });
      } else {
        dispatch(complete(response));
      }
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};

// Logins may indicate new devices, so use this time to set a new
// push notification, or to clear the old one.
export default (utln: string, code: string) => (dispatch: Dispatch) => {
  dispatch(initiate());
  Permissions.getAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
    if (status === 'granted') {
      requestNotificationToken().then(expoPushToken => {
        if (expoPushToken !== null) {
          verify(dispatch, utln, code, expoPushToken);
        } else {
          verify(dispatch, utln, code);
        }
      });
    } else {
      verify(dispatch, utln, code);
    }
  });
};
