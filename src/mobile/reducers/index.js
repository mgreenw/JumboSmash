// @flow

// Auth:
import type { sendVerificationEmail_response } from "mobile/actions/auth/sendVerificationEmail";
import type { login_response } from "mobile/actions/auth/login";
import {
  SEND_VERIFICATION_EMAIL_INITIATED,
  SEND_VERIFICATION_EMAIL_COMPLETED
} from "mobile/actions/auth/sendVerificationEmail";
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
  CREATE_PROFILE_AND_SETTINGS__INITIATED,
  CREATE_PROFILE_AND_SETTINGS__COMPLETED
} from "mobile/actions/app/createUser";

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
  bio: string,
  images: $ReadOnlyArray<?string>
};

export type Candidate = {
  userId: number,
  profile: UserProfile
};

// the client
export type User = {
  profile: UserProfile,
  settings: UserSettings
};

// TODO: seperate state into profile, meta, API responses, etc.
export type ReduxState = {
  token: ?string,

  ///////////////////
  // app data:
  ///////////////////

  user: ?User,

  ///////////////////
  // action states:
  ///////////////////

  authLoaded: boolean,
  appLoaded: boolean,

  inProgress: {
    loadAuth: boolean,
    sendVerificationEmail: boolean,
    logout: boolean,
    login: boolean,
    loadApp: boolean,
    createUser: boolean
  },

  // Unfortunately, we really need case analysis for a few calls.
  response: {
    sendVerificationEmail: ?sendVerificationEmail_response,
    login: ?login_response
  }
};

const defaultState: ReduxState = {
  token: null,
  user: null,
  loggedIn: false,
  authLoaded: false,
  appLoaded: false,
  inProgress: {
    loadAuth: false,
    sendVerificationEmail: false,
    logout: false,
    login: false,
    loadApp: false,
    createUser: false
  },
  response: {
    sendVerificationEmail: null,
    login: null
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
        token: action.response ? action.response.token : null,
        inProgress: {
          ...state.inProgress,
          login: false
        },
        response: {
          ...state.response,
          login: action.response
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
        user: null,
        appLoaded: false,
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
        user: action.user,
        inProgress: {
          ...state.inProgress,
          loadApp: false
        }
      };
    }

    case CREATE_PROFILE_AND_SETTINGS__INITIATED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          createUser: true
        }
      };
    }

    case CREATE_PROFILE_AND_SETTINGS__COMPLETED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          createUser: false
        }
      };
    }

    case SEND_VERIFICATION_EMAIL_INITIATED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendVerificationEmail: true
        }
      };
    }

    case SEND_VERIFICATION_EMAIL_COMPLETED: {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendVerificationEmail: false
        },
        response: {
          ...state.response,
          sendVerificationEmail: action.response
        }
      };
    }

    default: {
      return state;
    }
  }
}
