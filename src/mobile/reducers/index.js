// @flow

import { INITIATE_REGISTRATION } from '../actions/auth';
import _ from 'lodash';

type State = {
  userName: string,
  loggedIn: boolean,
  registerInProgress: boolean,
}

const defaultState = {
  userName: 'jjaffe01',
  checkingAuth: true,
  loggedIn: false,
  registerInProgress: false,
}


// TODO: look into the type for action
export default function rootReducer(state: State = defaultState, action: any) {
  switch(action.type) {
    case INITIATE_REGISTRATION: {
      console.log('Reducer for INITIATE_REGISTRATION');
      _.assign(state, {
        registerInProgress: true,
      });
      return state;
    }
    default: {
      return state
    }
  }
}
