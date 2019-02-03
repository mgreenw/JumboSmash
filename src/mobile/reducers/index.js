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
import type {
  Unauthorized_Action,
  Error_Action
} from "mobile/actions/apiErrorHandler";
import type {
  UploadPhotoInitiated_Action,
  UploadPhotoCompleted_Action
} from "mobile/actions/app/uploadPhoto";
import type {
  DeletePhotoInitiated_Action,
  DeletePhotoCompleted_Action
} from "mobile/actions/app/deletePhoto";

export type PhotoIds = $ReadOnlyArray<number>;

///////////////
// USER TYPES:
///////////////
export type Genders = {
  male: boolean,
  female: boolean,
  nonBinary: boolean
};

export type UserSettings = {
  useGenders: Genders,
  wantGenders: Genders
};

export type UserProfile = {
  displayName: string,
  birthday: string,
  bio: string,
  photoIds: PhotoIds
};

type BaseUser = { userId: number, profile: UserProfile };
export type Client = BaseUser & { settings: UserSettings };
export type Candidate = BaseUser; // TODO: add scenes
type User = Client | Candidate;

// TODO: seperate state into profile, meta, API responses, etc.
export type ReduxState = {
  // app data:
  client: ?Client,
  token: ?string,

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
    createUser: boolean,
    saveProfile: boolean,
    uploadPhoto: boolean,
    deletePhoto: boolean
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
  | Unauthorized_Action
  | Error_Action
  | UploadPhotoCompleted_Action
  | UploadPhotoInitiated_Action
  | DeletePhotoCompleted_Action
  | DeletePhotoInitiated_Action;

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
    createUser: false,
    saveProfile: false,
    uploadPhoto: false,
    deletePhoto: false
  },
  response: {
    sendVerificationEmail: null,
    login: null
  },
  onboardingCompleted: false
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
    case "LOAD_APP__INITIATED": {
      return {
        ...state,
        appLoaded: false,
        inProgress: {
          ...state.inProgress,
          loadApp: true
        }
      };
    }

    case "LOAD_APP__COMPLETED": {
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
      const { profile } = action.payload;
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveProfile: false
        },
        client: {
          ...state.client,
          profile
        }
      };
    }

    case "UNAUTHORIZED": {
      return state;
    }

    case "SERVER_ERROR": {
      return state;
    }

    case "UPLOAD_PHOTO__INITIATED": {
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
    case "UPLOAD_PHOTO__COMPLETED": {
      if (!state.client) {
        throw "User null in reducer for UPLOAD_PHOTO__COMPLETED";
      }
      const { profile } = state.client;
      const { photoId } = action.payload;
      let newPhotoIds = profile.photoIds.slice();
      newPhotoIds.push(photoId);
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
            photoIds: newPhotoIds
          }
        }
      };
    }

    case "DELETE_PHOTO__INITIATED": {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          deletePhoto: true
        }
      };
    }

    case "DELETE_PHOTO__COMPLETED": {
      if (!state.client) {
        throw "User null in reducer for DELETE_PHOTO__COMPLETED";
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
            photoIds: photoIds
          }
        }
      };
    }

    default: {
      (action: empty); // ensures we have handled all cases
      return state;
    }
  }
}
