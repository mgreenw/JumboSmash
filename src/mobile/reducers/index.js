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

  loggedIn: boolean,
  authLoaded: boolean,

  inProgress: {
    loadAuth: boolean,
    logout: boolean,
    login: boolean
  }
};

const defaultState: State = {
  utln: "",
  token: null,
  loggedIn: false,
  authLoaded: false,
  inProgress: {
    loadAuth: false,
    logout: false,
    login: false
  }
};

export default function rootReducer(state: State = defaultState, action: any) {
  // $FlowFixMe (__DEV__ will break flow)
  if (__DEV__) {
    console.log(action.type);
  }
  switch (action.type) {
    // LOGIN:
    case LOGIN_INITIATED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          login: true
        }
      };
    }

    case LOGIN_COMPLETED: {
      return {
        ...state,
        loggedIn: true,
        utln: action.utln,
        token: action.token,
        inProgress: {
          ...state.inProgress,
          login: true
        }
      };
    }

    // LOGOUT:
    case LOGOUT_INITIATED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          logout: true
        }
      };
    }

    case LOGOUT_COMPLETED: {
      return {
        ...state,
        utln: "",
        token: null,
        loggedIn: false,
        inProgress: {
          ...state.inProgress,
          logout: false
        }
      };
    }

    // LOAD AUTH:
    case LOAD_AUTH__INITIATED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          loadAuth: true
        }
      };
    }

    case LOAD_AUTH__COMPLETED: {
      return {
        ...state,
        utln: action.utln,
        token: action.token,
        authLoaded: true,
        inProgress: {
          ...state.inProgress,
          loadAuth: false
        }
      };
    }

    default: {
      return state;
    }
  }
}
