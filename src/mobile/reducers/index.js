// @flow

// Auth:
import { LOGIN_INITIATED, LOGIN_COMPLETED } from "mobile/actions/auth/login";
import { LOGOUT_INITIATED, LOGOUT_COMPLETED } from "mobile/actions/auth/logout";
import {
  LOAD_AUTH__INITIATED,
  LOAD_AUTH__COMPLETED
} from "mobile/actions/auth/loadAuth";

// TODO: make own ReduxState file
export type Pronouns = {
  he: boolean,
  she: boolean,
  they: boolean
};

export type AppSettings = {};

// TODO: seperate state into profile, meta, API responses, etc.
export type ReduxState = {
  utln: string,
  token: ?string,

  ///////////////////
  // app data:
  ///////////////////

  settings: ?AppSettings,

  ///////////////////
  // action states:
  ///////////////////

  loggedIn: boolean,
  authLoaded: boolean,
  settingsLoaded: boolean,

  inProgress: {
    loadAuth: boolean,
    logout: boolean,
    login: boolean,

    loadSettings: boolean
  }
};

const defaultState: ReduxState = {
  utln: "",
  token: null,
  settings: null,
  loggedIn: false,
  authLoaded: false,
  settingsLoaded: false,
  inProgress: {
    loadAuth: false,
    logout: false,
    login: false,
    loadSettings: false
  }
};

export default function rootReducer(
  state: ReduxState = defaultState,
  action: any
) {
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
          login: false
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
