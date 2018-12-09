// @flow

// Auth:
import { LOGIN_INITIATED, LOGIN_COMPLETED } from "mobile/actions/auth/login";
import { LOGOUT_INITIATED, LOGOUT_COMPLETED } from "mobile/actions/auth/logout";
import {
  LOAD_AUTH__INITIATED,
  LOAD_AUTH__COMPLETED
} from "mobile/actions/auth/loadAuth";
import {
  LOAD_APP__INITIATED,
  LOAD_APP__COMPLETED
} from "mobile/actions/app/loadApp";

import {
  LOAD_CANDIDATES__INITIATED,
  LOAD_CANDIDATES__COMPLETED
} from "mobile/actions/app/loadCandidates";

// TODO: make own ReduxState file
export type Pronouns = {
  he: boolean,
  she: boolean,
  they: boolean
};

export type UserSettings = {
  usePronouns: Pronouns,
  wantPronouns: Pronouns
};

// TODO:
export type UserProfile = {
  displayName: string,
  birthday: string,
  bio: string
  //images: $ReadOnlyArray<?string>
};

export type Candidate = {
  userId: number,
  profile: UserProfile
};

// TODO: seperate state into profile, meta, API responses, etc.
export type ReduxState = {
  utln: string,
  token: ?string,

  ///////////////////
  // app data:
  ///////////////////

  settings: ?UserSettings,
  profile: ?UserProfile,
  candidates: ?Array<Candidate>,

  ///////////////////
  // action states:
  ///////////////////

  loggedIn: boolean,
  authLoaded: boolean,
  appLoaded: boolean,
  candidatesLoaded: boolean,

  inProgress: {
    loadAuth: boolean,
    logout: boolean,
    login: boolean,
    loadApp: boolean,
    loadCandidates: boolean
  }
};

const defaultState: ReduxState = {
  utln: "",
  token: null,
  settings: null,
  profile: null,
  candidates: null,
  loggedIn: false,
  authLoaded: false,
  appLoaded: false,
  candidatesLoaded: false,
  inProgress: {
    loadAuth: false,
    logout: false,
    login: false,
    loadApp: false,
    loadCandidates: false
  }
};

export default function rootReducer(
  state: ReduxState = defaultState,
  action: any
): ReduxState {
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

    // LOAD APP:
    case LOAD_APP__INITIATED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          loadApp: true
        }
      };
    }

    case LOAD_APP__COMPLETED: {
      return {
        ...state,
        appLoaded: true,
        settings: action.settings,
        profile: action.profile,
        inProgress: {
          ...state.inProgress,
          loadApp: false
        }
      };
    }

    // LOAD CANDIDATES:
    case LOAD_CANDIDATES__INITIATED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          loadCandidates: true
        }
      };
    }

    case LOAD_CANDIDATES__COMPLETED: {
      return {
        ...state,
        candidatesLoaded: true,
        candidates: action.candidates,
        inProgress: {
          ...state.inProgress,
          loadCandidates: false
        }
      };
    }

    default: {
      return state;
    }
  }
}
