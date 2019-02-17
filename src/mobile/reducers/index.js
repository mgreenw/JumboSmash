// @flow

// Auth:
import type {
  SendVerificationEmail_Response,
  SendVerificationEmailCompleted_Action,
  SendVerificationEmailInitiated_Action
} from 'mobile/actions/auth/sendVerificationEmail';
import type {
  Login_Response,
  LoginInitiated_Action,
  LoginCompleted_Action
} from 'mobile/actions/auth/login';
import type {
  LogoutInitiated_Action,
  LogoutCompleted_Action
} from 'mobile/actions/auth/logout';
import type {
  LoadAuthCompleted_Action,
  LoadAuthInitiated_Action
} from 'mobile/actions/auth/loadAuth';
import type {
  LoadAppCompleted_Action,
  LoadAppInitiated_Action
} from 'mobile/actions/app/loadApp';
import type {
  CreateProfileAndSettingsInitiated_Action,
  CreateProfileAndSettingsCompleted_Action
} from 'mobile/actions/app/createUser';
import type {
  SaveProfileFieldsInitiated_Action,
  SaveProfileFieldsCompleted_Action
} from 'mobile/actions/app/saveProfile';
import type {
  Unauthorized_Action,
  Error_Action
} from 'mobile/actions/apiErrorHandler';
import type {
  UploadPhotoInitiated_Action,
  UploadPhotoCompleted_Action
} from 'mobile/actions/app/uploadPhoto';
import type {
  DeletePhotoInitiated_Action,
  DeletePhotoCompleted_Action
} from 'mobile/actions/app/deletePhoto';
import type {
  SaveSettingsInitiated_Action,
  SaveSettingsCompleted_Action
} from 'mobile/actions/app/saveSettings';
import type {
  GetSceneCandidatesInitiated_Action,
  GetSceneCandidatesCompleted_Action
} from 'mobile/actions/app/getSceneCandidates';
import type {
  GetMatchesInitiated_Action,
  GetMatchesCompleted_Action
} from 'mobile/actions/app/getMatches';
import { isFSA } from 'mobile/utils/fluxStandardAction';
import type { Dispatch as ReduxDispatch } from 'redux';

// /////////////
// USER TYPES:
// /////////////
export type Genders = {
  man: boolean,
  woman: boolean,
  nonBinary: boolean
};

export type UserSettings = {
  identifyAsGenders: Genders,
  lookingForGenders: Genders
};

export type ProfileFields = {
  displayName: string,
  birthday: string,
  bio: string
};

export type UserProfile = {
  fields: ProfileFields,
  photoIds: number[]
};

type SceneMatchTimes = {
  smash: ?string,
  social: ?string,
  stone: ?string
};

type BaseUser = { userId: number, profile: UserProfile };
export type Client = BaseUser & { settings: UserSettings };
export type Candidate = BaseUser;
export type Match = BaseUser & {
  scenes: SceneMatchTimes
};

export type SceneCandidates = {
  smash: ?(Candidate[]),
  social: ?(Candidate[]),
  stone: ?(Candidate[])
};

export type GetSceneCandidatesInProgress = {
  smash: boolean,
  social: boolean,
  stone: boolean
};

export type Scene = 'smash' | 'social' | 'stone';

// TODO: enable if needed. This is a conceptual type.
// type User = Client | Candidate;

// TODO: seperate state into profile, meta, API responses, etc.
export type ReduxState = {
  // app data:
  client: ?Client,
  token: ?string,
  sceneCandidates: SceneCandidates,

  // action states:
  authLoaded: boolean,
  appLoaded: boolean,
  onboardingCompleted: boolean,

  inProgress: {
    loadAuth: boolean,
    sendVerificationEmail: boolean,
    logout: boolean,
    login: boolean,
    loadApp: boolean,
    getSceneCandidates: GetSceneCandidatesInProgress,
    createUser: boolean,
    saveProfile: boolean,
    saveSettings: boolean,
    uploadPhoto: boolean,
    deletePhoto: boolean,
    getMatches: boolean
  },

  // Unfortunately, we really need case analysis for a few calls that we
  // trigger different component states for different errors.
  response: {
    sendVerificationEmail: ?SendVerificationEmail_Response,
    login: ?Login_Response
  },

  matches: ?(Match[])
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
  | SaveProfileFieldsInitiated_Action
  | SaveProfileFieldsCompleted_Action
  | Unauthorized_Action
  | Error_Action
  | UploadPhotoCompleted_Action
  | UploadPhotoInitiated_Action
  | DeletePhotoCompleted_Action
  | DeletePhotoInitiated_Action
  | SaveSettingsInitiated_Action
  | SaveSettingsCompleted_Action
  | GetSceneCandidatesInitiated_Action
  | GetSceneCandidatesCompleted_Action
  | GetMatchesInitiated_Action
  | GetMatchesCompleted_Action;

export type GetState = () => ReduxState;

// eslint-disable-next-line no-use-before-define
export type Dispatch = ReduxDispatch<Action> & Thunk<Action>;
export type Thunk<A> = ((Dispatch, GetState) => Promise<void> | void) => A;

const defaultState: ReduxState = {
  token: null,
  client: null,
  loggedIn: false,
  authLoaded: false,
  appLoaded: false,
  inProgress: {
    loadAuth: false,
    sendVerificationEmail: false,
    logout: false,
    login: false,
    loadApp: false,
    getSceneCandidates: {
      smash: false,
      social: false,
      stone: false
    },
    createUser: false,
    saveProfile: false,
    saveSettings: false,
    uploadPhoto: false,
    deletePhoto: false,
    getMatches: false
  },
  response: {
    sendVerificationEmail: null,
    login: null
  },
  onboardingCompleted: false,
  sceneCandidates: {
    smash: null,
    social: null,
    stone: null
  },
  matches: null
};

export default function rootReducer(
  state: ReduxState = defaultState,
  action: Action
): ReduxState {
  // Sanity check for our actions abiding FSA format.
  if (!isFSA(action)) {
    throw ('Err: Action is not FSA', action);
  }

  switch (action.type) {
    // LOGIN:
    case 'LOGIN_INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          login: true
        }
      };
    }

    case 'LOGIN_COMPLETED': {
      const { response } = action.payload;
      return {
        ...state,
        token: response ? response.token : null,
        inProgress: {
          ...state.inProgress,
          login: false
        },
        response: {
          ...state.response,
          login: response
        }
      };
    }

    // LOGOUT:
    case 'LOGOUT_INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          logout: true
        }
      };
    }

    case 'LOGOUT_COMPLETED': {
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
    case 'LOAD_AUTH__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          loadAuth: true
        }
      };
    }

    case 'LOAD_AUTH__COMPLETED': {
      const { token } = action.payload;
      return {
        ...state,
        token,
        authLoaded: true,
        inProgress: {
          ...state.inProgress,
          loadAuth: false
        }
      };
    }

    // LOAD APP:
    case 'LOAD_APP__INITIATED': {
      return {
        ...state,
        appLoaded: false,
        inProgress: {
          ...state.inProgress,
          loadApp: true
        }
      };
    }

    case 'LOAD_APP__COMPLETED': {
      const { profile, settings, onboardingCompleted } = action.payload;
      return {
        ...state,
        appLoaded: true,
        client: {
          userId: 0, // TODO: RETRIEVE THIS
          profile,
          settings
        },
        inProgress: {
          ...state.inProgress,
          loadApp: false
        },
        onboardingCompleted
      };
    }

    case 'CREATE_PROFILE_AND_SETTINGS__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          createUser: true
        }
      };
    }

    case 'CREATE_PROFILE_AND_SETTINGS__COMPLETED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          createUser: false
        }
      };
    }

    case 'SEND_VERIFICATION_EMAIL_INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendVerificationEmail: true
        }
      };
    }

    case 'SEND_VERIFICATION_EMAIL_COMPLETED': {
      const { response } = action.payload;
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendVerificationEmail: false
        },
        response: {
          ...state.response,
          sendVerificationEmail: response
        }
      };
    }

    case 'SAVE_PROFILE__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveProfile: true
        }
      };
    }

    case 'SAVE_PROFILE__COMPLETED': {
      const { fields } = action.payload;
      if (!state.client) {
        throw new Error('User null in reducer for SAVE_PROFILE__COMPLETED');
      }
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveProfile: false
        },
        client: {
          ...state.client,
          profile: {
            ...state.client.profile,
            fields
          }
        }
      };
    }

    case 'UNAUTHORIZED': {
      return state;
    }

    case 'SERVER_ERROR': {
      return state;
    }

    case 'UPLOAD_PHOTO__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          uploadPhoto: true
        }
      };
    }

    // After a succesful photo upload, update our list of photos to include
    // the ID for the new photo.
    case 'UPLOAD_PHOTO__COMPLETED': {
      if (!state.client) {
        throw new Error('User null in reducer for UPLOAD_PHOTO__COMPLETED');
      }
      const { profile } = state.client;
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          uploadPhoto: false
        },
        client: {
          ...state.client,
          profile: {
            ...profile,
            photoIds: action.payload.photoIds
          }
        }
      };
    }

    case 'DELETE_PHOTO__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          deletePhoto: true
        }
      };
    }

    case 'DELETE_PHOTO__COMPLETED': {
      if (!state.client) {
        throw new Error('User null in reducer for DELETE_PHOTO__COMPLETED');
      }
      const { photoIds } = action.payload;
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          deletePhoto: false
        },
        client: {
          ...state.client,
          profile: {
            ...state.client.profile,
            photoIds
          }
        }
      };
    }

    case 'GET_SCENE_CANDIDATES__INITIATED': {
      const { scene } = action.payload;
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getSceneCandidates: {
            ...state.inProgress.getSceneCandidates,
            [scene]: true
          }
        }
      };
    }
    case 'GET_MATCHES__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getMatches: true
        }
      };
    }

    case 'GET_SCENE_CANDIDATES__COMPLETED': {
      const { candidates, scene } = action.payload;
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getSceneCandidates: {
            ...state.inProgress.getSceneCandidates,
            [scene]: false
          }
        },
        sceneCandidates: {
          ...state.sceneCandidates,
          [scene]: candidates
        }
      };
    }
    case 'GET_MATCHES__COMPLETED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getMatches: false
        },
        matches: action.payload
      };
    }

    case 'SAVE_SETTINGS__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveSettings: true
        }
      };
    }

    case 'SAVE_SETTINGS__COMPLETED': {
      if (!state.client) {
        throw new Error('User null in reducer for SAVE_SETTINGS__COMPLETED');
      }
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveProfile: false
        },
        client: {
          ...state.client,
          settings: action.payload
        }
      };
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (action: empty); // ensures we have handled all cases
      return state;
    }
  }
}
