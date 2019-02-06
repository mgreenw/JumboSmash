// @flow
/* eslint-disable */

import type { Dispatch } from 'redux';
import { AsyncStorage } from 'react-native';
import verify from 'mobile/api/auth/verify';
import DevTesting from '../../utils/DevTesting';

export type login_response = {
  statusCode: 'SUCCESS' | 'BAD_CODE' | 'EXPIRED_CODE' | 'NO_EMAIL_SENT',
  token?: string,
};

export type LoginInitiated_Action = {
  type: 'LOGIN_INITIATED',
  payload: {},
  meta: {},
};
export type LoginCompleted_Action = {
  type: 'LOGIN_COMPLETED',
  payload: {
    response: login_response,
  },
  meta: {},
};

function initiate(): LoginInitiated_Action {
  return {
    type: 'LOGIN_INITIATED',
    payload: {},
    meta: {},
  };
}

function complete(response: login_response): LoginCompleted_Action {
  return {
    type: 'LOGIN_COMPLETED',
    payload: {
      response,
    },
    meta: {},
  };
}

// TODO: consider error handling on the multiSet.
export function login(utln: string, code: string) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());

    DevTesting.fakeLatency(() => {
      verify({ utln, code }).then(response => {
        const token = response.token;
        // should be non-null, should be non-empty
        if (token) {
          AsyncStorage.multiSet([['token', token]]).then(errors => {
            if (errors) {
              DevTesting.log('Error in storing token:', errors);
            }
            dispatch(complete(response));
          });
        } else {
          dispatch(complete(response));
        }
      });
    });
  };
}
