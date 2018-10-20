// @flow
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

// Types:
import {
  LOGIN_WITH_NEW_TOKEN,
} from '../actions/auth/login.js';

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

      // TODO: store to async
      // https://reactnavigation.org/docs/en/auth-flow.html
      // https://medium.com/building-with-react-native/what-is-asyncstorage-in-react-native-and-how-you-to-use-it-with-app-state-manager-1x09-b8c636ce5f6e

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
