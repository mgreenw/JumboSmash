// @flow

import type { Dispatch } from 'mobile/reducers';
import { AsyncStorage } from 'react-native';
import verify from 'mobile/api/auth/verify';
import DevTesting from '../../utils/DevTesting';

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

// TODO: consider error handling on the multiSet.
export default (utln: string, code: string) => (dispatch: Dispatch) => {
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
