// @flow

import {
    INITIATE_REGISTRATION,
    SUCCEED_REGISTRATION,
    FAIL_REGISTRATION,
    ERROR_REGISTRATION
  } from '../actions/auth';
import _ from 'lodash';

type State = {
  userName: string,
  loggedIn: boolean,
  registerInProgress: boolean,
  errorMessage: ?string,
}

const defaultState: State = {
  userName: 'jjaffe01',
  loggedIn: false,
  registerInProgress: false,
  errorMessage: null,
}


// TODO: look into the type for action
export default function rootReducer(state: State = defaultState, action: any) {
  switch(action.type) {
    case INITIATE_REGISTRATION: {
      console.log('Reducer for INITIATE_REGISTRATION');

      return _.assign({}, state, {
        registerInProgress: true,
      });
    }

    case SUCCEED_REGISTRATION: {
      console.log('Reducer for SUCCEED_REGISTRATION');

      return _.assign({}, state, {
        registerInProgress: false,
      });
    }

    case FAIL_REGISTRATION: {
      console.log('Reducer for FAIL_REGISTRATION');

      return _.assign({}, state, {
        registerInProgress: false,
        errorMessage: action.errorMessage,
      });
    }

    case ERROR_REGISTRATION: {
      console.log('Reducer for ERROR_REGISTRATION');

      return _.assign({}, state, {
        registerInProgress: false,
        errorMessage: action.errorMessage,
      });
    }

    default: {
      return state
    }
  }
}
