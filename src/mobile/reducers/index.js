// @flow

// Auth:
import type {
  sendVerificationEmail_response,
  SendVerificationEmailCompleted_Action,
  SendVerificationEmailInitiated_Action
} from "mobile/actions/auth/sendVerificationEmail";
import type {
  login_response,
  LoginInitiated_Action,
  LoginCompleted_Action
} from "mobile/actions/auth/login";
import type {
  LogoutInitiated_Action,
  LogoutCompleted_Action
} from "mobile/actions/auth/logout";
import type {
  LoadAuthCompleted_Action,
  LoadAuthInitiated_Action
} from "mobile/actions/auth/loadAuth";
import type {
  LoadAppCompleted_Action,
  LoadAppInitiated_Action
} from "mobile/actions/app/loadApp";
import type {
  CreateProfileAndSettingsInitiated_Action,
  CreateProfileAndSettingsCompleted_Action
} from "mobile/actions/app/createUser";
import type {
  SaveProfileInitiated_Action,
  SaveProfileCompleted_Action
} from "mobile/actions/app/saveProfile";
import type { Unauthorized_Action } from "mobile/actions/apiErrorHandler";

// TODO: make own ReduxState file
export type Genders = {
  he: boolean,
  she: boolean,
  they: boolean
};

export type UserSettings = {
  useGenders: Genders,
  wantGenders: Genders
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
  // app data:
  user: ?User,
  token: ?string,

  // action states:
  authLoaded: boolean,
  appLoaded: boolean,

  inProgress: {
    loadAuth: boolean,
    sendVerificationEmail: boolean,
    logout: boolean,
    login: boolean,
    loadApp: boolean,
    createUser: boolean,
    saveProfile: boolean
  },

  // Unfortunately, we really need case analysis for a few calls that we
  // trigger different component states for different errors.
  response: {
    sendVerificationEmail: ?sendVerificationEmail_response,
    login: ?login_response
  }
};

export type Action =
  | LoginInitiated_Action
  | LoginCompleted_Action
  | LogoutInitiated_Action
  | LogoutCompleted_Action
  | LoadAuthInitiated_Action
  | LoadAuthCompleted_Action
  | LoadAppInitiated_Action
  | LoadAppCompleted_Action
  | CreateProfileAndSettingsInitiated_Action
  | CreateProfileAndSettingsCompleted_Action
  | SendVerificationEmailInitiated_Action
  | SendVerificationEmailCompleted_Action
  | SaveProfileInitiated_Action
  | SaveProfileCompleted_Action
  | Unauthorized_Action;

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
    createUser: false,
    saveProfile: false
  },
  response: {
    sendVerificationEmail: null,
    login: null
  }
};

export default function rootReducer(
  state: ReduxState = defaultState,
  action: Action
): ReduxState {
  switch (action.type) {
    // LOGIN:
    case "LOGIN_INITIATED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          login: true
        }
      };
    }

    case "LOGIN_COMPLETED": {
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
    case "LOGOUT_INITIATED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          logout: true
        }
      };
    }

    case "LOGOUT_COMPLETED": {
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
    case "LOAD_AUTH__INITIATED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          loadAuth: true
        }
      };
    }

    case "LOAD_AUTH__COMPLETED": {
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
    case "LOAD_APP__INITIATED": {
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

    case "LOAD_APP__COMPLETED": {
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

    case "CREATE_PROFILE_AND_SETTINGS__INITIATED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          createUser: true
        }
      };
    }

    case "CREATE_PROFILE_AND_SETTINGS__COMPLETED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          createUser: false
        }
      };
    }

    case "SEND_VERIFICATION_EMAIL_INITIATED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendVerificationEmail: true
        }
      };
    }

    case "SEND_VERIFICATION_EMAIL_COMPLETED": {
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

    case "SAVE_PROFILE__INITIATED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveProfile: true
        }
      };
    }

    case "SAVE_PROFILE__COMPLETED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveProfile: false
        },
        user: {
          ...state.user,
          profile: action.profile
        }
      };
    }

    case "UNAUTHORIZED": {
      return defaultState;
    }

    default: {
      (action: empty); // ensures we have handled all cases
      return state;
    }
  }
}
