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
import type {
  JudgeSceneCandidateInitiated_Action,
  JudgeSceneCandidateCompleted_Action
} from 'mobile/actions/app/judgeSceneCandidate';
import type {
  GetConversationInitiated_Action,
  GetConversationCompleted_Action
} from 'mobile/actions/app/getConversation';
import type {
  SendMessageInitiated_Action,
  SendMessageCompleted_Action
} from 'mobile/actions/app/sendMessage';
import { normalize, schema } from 'normalizr';

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
  lookingForGenders: Genders,
  activeScenes: {
    smash: boolean,
    social: boolean,
    stone: boolean
  }
};

export type ProfileFields = {|
  displayName: string,
  birthday: string,
  bio: string
|};

export type UserProfile = {|
  fields: ProfileFields,
  photoIds: number[]
|};

type SceneMatchTimes = {|
  smash: ?string,
  social: ?string,
  stone: ?string
|};

type BaseUser = {| userId: number, profile: UserProfile |};
export type Client = {| ...BaseUser, settings: UserSettings |};
export type Candidate = BaseUser;
export type Match = {| ...BaseUser, scenes: SceneMatchTimes |};

type Matches = Match[];

export type SceneCandidates = {|
  smash: ?(Candidate[]),
  social: ?(Candidate[]),
  stone: ?(Candidate[])
|};

export type ExcludeSceneCandidateIds = {|
  smash: number[],
  social: number[],
  stone: number[]
|};

export type GetSceneCandidatesInProgress = {|
  smash: boolean,
  social: boolean,
  stone: boolean
|};

export type Scene = 'smash' | 'social' | 'stone';

// For normalizer:
const ConfirmedMessageSchema = new schema.Entity(
  'messages',
  {},
  { idAttribute: 'messageId' }
);

export type Message = {|
  messageId: number,
  content: string,
  timestamp: string,
  fromClient: boolean,
  unconfirmedMessageUuid: string
|};

type GiftedChatUser = {|
  _id: string,
  name: string
|};

export type GiftedChatMessage = {|
  _id: string,
  text: string,
  createdAt: ?Date | number, // optional & accepts ducktyped date numbers
  user: GiftedChatUser
|};

// TODO: enable if needed. This is a conceptual type.
// type User = Client | Candidate;

// --------- //
// MESSAGES:
// --------- //

// Follows: https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape

// Keyed by server ID
type ConfirmedMessages = {|
  byId: {|
    [Id: number]: Message
  |},
  allIds: number[] // Id's in order
|};

// Keyed by client generated ID. Fine, because client only
// has unconfirmedMessages they generated ID's for then.
type UnconfirmedMessages = {|
  byId: {
    [UUID: string]: GiftedChatMessage
  },
  allIds: string[] // UUIDS in order
|};

type ConfirmedConversations = { [userId: number]: ConfirmedMessages };
type UnconfirmedConversations = { [userId: number]: UnconfirmedMessages };

// --------- //

// TODO: seperate state into profile, meta, API responses, etc.
export type ReduxState = {|
  // app data:
  client: ?Client,
  token: ?string,

  // action states:
  authLoaded: boolean,
  appLoaded: boolean,
  onboardingCompleted: boolean,

  inProgress: {|
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
    getMatches: boolean,

    sendMessage: { [userId: number]: { [messageUuid: string]: boolean } },

    // map of userID's to conversation fetches in progress
    getConversation: { [userId: number]: boolean }
  |},

  // Unfortunately, we really need case analysis for a few calls that we
  // trigger different component states for different errors.
  response: {|
    sendVerificationEmail: ?SendVerificationEmail_Response,
    login: ?Login_Response
  |},

  sceneCandidates: SceneCandidates,
  excludeSceneCandidateIds: ExcludeSceneCandidateIds,

  // map of userID's to messages
  confirmedConversations: ConfirmedConversations,

  // Located outside of inProgress for convienence,
  // because of how different this works compared to other reducers
  unconfirmedConversations: UnconfirmedConversations,

  // map of all profiles loaded
  profiles: { [userId: number]: UserProfile },

  matches: ?Matches,
  messagedMatchIds: ?(number[]),
  unmessagedMatchIds: ?(number[])
|};

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
  | GetMatchesCompleted_Action
  | JudgeSceneCandidateInitiated_Action
  | JudgeSceneCandidateCompleted_Action
  | GetConversationInitiated_Action
  | GetConversationCompleted_Action
  | SendMessageInitiated_Action
  | SendMessageCompleted_Action;

export type GetState = () => ReduxState;

// eslint-disable-next-line no-use-before-define
export type Dispatch = ReduxDispatch<Action> & Thunk<Action>;
export type Thunk<A> = ((Dispatch, GetState) => Promise<void> | void) => A;

const defaultState: ReduxState = {
  token: null,
  client: null,
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
    getMatches: false,
    getConversation: {},
    sendMessage: {}
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
  excludeSceneCandidateIds: {
    smash: [],
    social: [],
    stone: []
  },
  confirmedConversations: {},
  unconfirmedConversations: {},
  profiles: {},

  // before loaded
  matches: null,
  messagedMatchIds: null,
  unmessagedMatchIds: null
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
      const getSceneCandidatesInProgress_updated = {
        ...state.inProgress.getSceneCandidates,
        [scene]: true
      };
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getSceneCandidates: getSceneCandidatesInProgress_updated
        }
      };
    }

    case 'GET_SCENE_CANDIDATES__COMPLETED': {
      const { candidates, scene } = action.payload;
      const getSceneCandidatesInProgress_updated = {
        ...state.inProgress.getSceneCandidates,
        [scene]: false
      };

      const sceneCandidates_updated = {
        ...state.sceneCandidates,
        [scene]: candidates
      };
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getSceneCandidates: getSceneCandidatesInProgress_updated
        },
        sceneCandidates: sceneCandidates_updated
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

    case 'JUDGE_SCENE_CANDIDATE__INITIATED': {
      const { candidateUserId, scene } = action.payload;
      const currentSceneCandidates = state.sceneCandidates[scene];
      if (
        currentSceneCandidates === null ||
        currentSceneCandidates === undefined
      ) {
        throw new Error(
          'currentSceneCandidates is null in judge scene candidates'
        );
      }

      const sceneCandidates_updated = {
        ...state.sceneCandidates,
        [scene]: currentSceneCandidates.filter(
          c => c.userId !== candidateUserId
        )
      };

      const excludeSceneCandidateIds_updated = {
        ...state.excludeSceneCandidateIds,
        [scene]: [...state.excludeSceneCandidateIds[scene], candidateUserId]
      };

      return {
        ...state,
        sceneCandidates: sceneCandidates_updated,
        excludeSceneCandidateIds: excludeSceneCandidateIds_updated
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
          saveSettings: false
        },
        client: {
          ...state.client,
          settings: action.payload
        }
      };
    }
    case 'JUDGE_SCENE_CANDIDATE__COMPLETED': {
      const { candidateUserId, scene } = action.payload;
      const currentExcludeSceneCandidateIds =
        state.excludeSceneCandidateIds[scene];

      const excludeSceneCandidateIds_updated = {
        ...state.excludeSceneCandidateIds,
        [scene]: currentExcludeSceneCandidateIds.filter(
          id => id !== candidateUserId
        )
      };

      return {
        ...state,
        excludeSceneCandidateIds: excludeSceneCandidateIds_updated
      };
    }

    // The conversation reducers have some special stuff going on to:
    //    1. Ensure that our redux state is always immutable
    //    2. Flow type every step of the copying process.
    case 'GET_CONVERSATION__INITIATED': {
      const { userId } = action.payload;

      // Copy the original conversations-in-progress map
      const inProgressConversations_updated: {
        [userId: number]: boolean
      } = Object.assign({}, state.inProgress.getConversation);
      inProgressConversations_updated[userId] = true;

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getConversation: inProgressConversations_updated
        }
      };
    }

    case 'GET_CONVERSATION__COMPLETED': {
      const { userId, messages } = action.payload;
      // TODO: ensure 'result' for array order is preserved
      // pretty sure it's preserved via testing, but not sure via their docs
      const { result: orderedIds, entities } = normalize(messages, [
        ConfirmedMessageSchema
      ]);

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getConversation: {
            ...state.inProgress.getConversation,
            [userId]: false
          }
        },
        confirmedConversations: {
          ...state.confirmedConversations,
          [userId]: {
            allIds: orderedIds,
            byId: entities.messages
          }
        }
      };
    }

    case 'SEND_MESSAGE__INITIATED': {
      const { receiverUserId, giftedChatMessage } = action.payload;

      // Initialize to an empty object in case this is the first time sending a message
      // for a fresh store so that we can destructure with defaults.
      const unsentMessages =
        state.unconfirmedConversations[receiverUserId] || {};
      const { byId = {}, allIds = [] } = unsentMessages;
      const uuid = giftedChatMessage._id;

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendMessage: {
            ...state.inProgress.sendMessage,
            [receiverUserId]: {
              ...state.inProgress.sendMessage[receiverUserId],
              [uuid]: true
            }
          }
        },
        unconfirmedConversations: {
          ...state.unconfirmedConversations,
          [receiverUserId]: {
            byId: {
              ...byId,
              [uuid]: giftedChatMessage
            },
            allIds: [...allIds, uuid]
          }
        }
      };
    }

    case 'SEND_MESSAGE__COMPLETED': {
      const { receiverUserId, previousMessageId, message } = action.payload;
      const { messageId: id, unconfirmedMessageUuid: uuid } = message;

      // remove the sent message from the unsent list
      const newUnsentMessageOrder = state.unconfirmedConversations[
        receiverUserId
      ].allIds.filter(i => i !== uuid);

      // NOTE: state.inProgress.sendMessage[receiverUserId] CAN be undefined,
      // but because it is accessed within an object, the spread operator
      // will return an empty array if so.
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendMessage: {
            ...state.inProgress.sendMessage,
            [receiverUserId]: {
              ...state.inProgress.sendMessage[receiverUserId],
              [uuid]: false
            }
          }
        },
        confirmedConversations: {
          ...state.confirmedConversations,
          [receiverUserId]: {
            byId: {
              ...state.confirmedConversations[receiverUserId].byId,
              [id]: message
            },
            allIds: [...state.confirmedConversations[receiverUserId].allIds, id]
          }
        },
        // Must have values because initialized on Send Message Initiate
        // TODO: consider deleting the message from unconfirmed byIds. (For invarients?)
        unconfirmedConversations: {
          ...state.unconfirmedConversations,
          [receiverUserId]: {
            ...state.unconfirmedConversations[receiverUserId],
            allIds: newUnsentMessageOrder
          }
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
