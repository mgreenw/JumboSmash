// @flow

import {
  LOGIN_WITH_NEW_TOKEN,
} from '../actions/auth/login.js';

import _ from 'lodash';

// TODO: seperate state into profile, meta, API responses, etc.
type State = {
  utln: string,
  loggedIn: boolean,
  token: ?string
}

const defaultState: State = {
  utln: '',
  token: null,
  loggedIn: false,
}

export default function rootReducer(state: State = defaultState, action: any) {
  switch(action.type) {
    case LOGIN_WITH_NEW_TOKEN: {
      console.log('REDUCER', action);
      return _.assign({}, state, {
        utln: action.utln,
        token: action.token,
        loggedIn: true,
      })
    }

    default: {
      return state
    }
  }
}
