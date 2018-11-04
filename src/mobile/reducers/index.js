// @flow
import { AsyncStorage } from "react-native";
import _ from "lodash";

// Auth:
import { LOGIN_INITIATED, LOGIN_COMPLETED } from "../actions/auth/login.js";
import { LOGOUT_INITIATED, LOGOUT_COMPLETED } from "../actions/auth/logout.js";
import {
  LOAD_AUTH__INITIATED,
  LOAD_AUTH__COMPLETED
} from "../actions/auth/loadAuth.js";

// TODO: seperate state into profile, meta, API responses, etc.
type State = {
  utln: string,
  token: ?string,

  ///////////////////
  // action states:
  ///////////////////

  // login / logout:
  loggedIn: boolean,
  logout_inProgress: boolean,
  login_inProgress: boolean,

  // auth loading
  authLoaded: boolean,
  loadAuth_inProgress: boolean
};

const defaultState: State = {
  utln: "",
  token: null,
  loggedIn: false,
  logout_inProgress: false,
  login_inProgress: false,
  authLoaded: false,
  loadAuth_inProgress: false
};

export default function rootReducer(state: State = defaultState, action: any) {
  // $FlowFixMe (__DEV__ will break flow)
  if (__DEV__) {
    console.log(action.type);
  }
  switch (action.type) {
    // LOGIN:
    case LOGIN_INITIATED: {
      return _.assign({}, state, {
        login_inProgress: true
      });
    }

    case LOGIN_COMPLETED: {
      return _.assign({}, state, {
        login_inProgress: false,
        loggedIn: true,
        utln: action.utln,
        token: action.token
      });
    }

    // LOGOUT:
    case LOGOUT_INITIATED: {
      return _.assign({}, state, {
        logout_inProgress: true
      });
    }

    case LOGOUT_COMPLETED: {
      return _.assign({}, state, {
        utln: "",
        token: null,
        logout_inProgress: false,
        loggedIn: false
      });
    }

    // LOAD AUTH:
    case LOAD_AUTH__INITIATED: {
      return _.assign({}, state, {
        loadAuth_inProgress: true
      });
    }

    case LOAD_AUTH__COMPLETED: {
      return _.assign({}, state, {
        utln: action.utln,
        token: action.token,
        loadAuth_inProgress: false,
        authLoaded: true
      });
    }

    default: {
      return state;
    }
  }
}
