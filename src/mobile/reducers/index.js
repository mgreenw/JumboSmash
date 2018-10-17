// @flow

import type { apiResponse } from '../actions/apiResponse'

import {
    SEND_VERIFICATION_EMAIL__INITIATE,
    SEND_VERIFICATION_EMAIL__SUCCESS,
    SEND_VERIFICATION_EMAIL__FAILURE,
  } from '../actions/auth';

import {
  SERVER_ERROR,
  BAD_REQUEST,
  TOO_MANY_REQUESTS,
} from '../actions/errors'

import _ from 'lodash';

// TODO: seperate state into profile, meta, API responses, etc.
type State = {
  utln: string,
  loggedIn: boolean,
  sendVerificationEmail_Response: ?apiResponse, // null when not yet occured
  sendVerificationEmail_InProgress: boolean,
}

const defaultState: State = {
  utln: 'jjaffe01',
  loggedIn: false,
  sendVerificationEmail_Response: null,
  sendVerificationEmail_InProgress: false,
}

// TODO: create a middleware that automatically creates these assignments.

export default function rootReducer(state: State = defaultState, action: any) {
  switch(action.type) {
    case SEND_VERIFICATION_EMAIL__INITIATE: {
      console.log('Reducer for SEND_VERIFICATION_EMAIL__INITIATE');

      return _.assign({}, state, {
        sendVerificationInProgress: true,
      });
    }

    case SEND_VERIFICATION_EMAIL__SUCCESS: {
      console.log('Reducer for SEND_VERIFICATION_EMAIL__SUCCESS');

      return _.assign({}, state, {
        sendVerificationInProgress: false,
        sendVerificationEmail_Response: {
          statusCode: action.type,
          success: true,
          errorMessage: null,
          successBody: {
            email: action.email
          },
        },
      });
    }

    case SEND_VERIFICATION_EMAIL__FAILURE: {
      console.log('Reducer for SEND_VERIFICATION_EMAIL__FAILURE');

      return _.assign({}, state, {
        sendVerificationInProgress: false,
        sendVerificationEmail_Response: {
          statusCode: action.type,
          success: false,
          errorMessage: action.errorMessage,
          successBody: null,
        },
      });
    }

    default: {
      return state
    }
  }
}
