// @flow

// Auth:
import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import type { SendVerificationEmail_Response } from 'mobile/actions/auth/sendVerificationEmail';
import type { SendVerificationEmail_Action } from 'mobile/reducers/auth/sendVerificationEmail';
import type {
  Login_Response,
  LoginInitiated_Action,
  LoginCompleted_Action,
  LoginFailed_Action
} from 'mobile/actions/auth/login';
import type { Logout_Action } from 'mobile/reducers/auth/logout';
import type {
  LoadAuthCompleted_Action,
  LoadAuthInitiated_Action
} from 'mobile/actions/auth/loadAuth';
import type {
  LoadAppCompleted_Action,
  LoadAppFailed_Action,
  LoadAppInitiated_Action
} from 'mobile/actions/app/loadApp';
import type {
  CreateUserInitiated_Action,
  CreateUserCompleted_Action,
  CreateUserFailed_Action
} from 'mobile/actions/app/createUser';
import type {
  SaveProfileFieldsInitiated_Action,
  SaveProfileFieldsCompleted_Action,
  SaveProfileFieldsFailed_Action
} from 'mobile/actions/app/saveProfile';
import type {
  Unauthorized_Action,
  ServerError_Action,
  NetworkError_Action,
  Terminated_Action
} from 'mobile/actions/apiErrorHandler';
import type {
  UploadPhotoInitiated_Action,
  UploadPhotoCompleted_Action,
  UploadPhotoFailed_Action
} from 'mobile/actions/app/uploadPhoto';
import type {
  DeletePhotoInitiated_Action,
  DeletePhotoCompleted_Action,
  DeletePhotoFailed_Action
} from 'mobile/actions/app/deletePhoto';
import type {
  SaveSettingsInitiated_Action,
  SaveSettingsCompleted_Action,
  SaveSettingsFailed_Action
} from 'mobile/actions/app/saveSettings';
import type {
  GetSceneCandidatesInitiated_Action,
  GetSceneCandidatesCompleted_Action
} from 'mobile/actions/app/getSceneCandidates';
import type {
  GetMatchesInitiated_Action,
  GetMatchesCompleted_Action,
  GetMatchesFailed_Action
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
  SendMessageCompleted_Action,
  SendMessageFailed_Action
} from 'mobile/actions/app/sendMessage';
import type {
  SummonPopup_Action,
  DismissPopup_Action
} from 'mobile/actions/popup';
import type {
  ReadReceiptUpdateInitiated_Action,
  ReadReceiptUpdateCompleted_Action
} from 'mobile/actions/app/notifications/readReceiptUpdate';
import type {
  NewMessageInitiated_Action,
  NewMessageCompleted_Action
} from 'mobile/actions/app/notifications/newMessage';
import type {
  NewMatchInitiated_Action,
  NewMatchCompleted_Action
} from 'mobile/actions/app/notifications/newMatch';
import type { CancelFailedMessage_Action } from 'mobile/actions/app/cancelFailedMessage';
import type {
  BlockUserInitiated_Action,
  BlockUserCompleted_Action,
  BlockUserFailed_Action
} from 'mobile/actions/app/blockUser';
import type {
  ReportUserInitiated_Action,
  ReportUserCompleted_Action,
  ReportUserFailed_Action
} from 'mobile/actions/app/reportUser';
import type {
  UnmatchInitiated_Action,
  UnmatchCompleted_Action,
  UnmatchFailed_Action
} from 'mobile/actions/app/unmatch';
import type {
  SendFeedbackInitiated_Action,
  SendFeedbackCompleted_Action,
  SendFeedbackFailed_Action
} from 'mobile/actions/app/meta/sendFeedback';
import type {
  GetProfileInitiated_Action,
  GetProfileCompleted_Action,
  GetProfileFailed_Action
} from 'mobile/actions/users/getProfile';
import { normalize, schema } from 'normalizr';

import { isFSA } from 'mobile/utils/fluxStandardAction';
import type { Dispatch as ReduxDispatch } from 'redux';
import type {
  ServerMatch,
  ServerMessage,
  ServerCandidate,
  ServerReadReceipt,
  ServerClassmate
} from 'mobile/api/serverTypes';
import type { GetClassmates_Action } from './admin/getClassmates';
import type { ReadMessage_Action } from './conversations/readMessage';
import type { NetworkChange_Action } from './offline-fork';
import { handleNetworkChange, CONNECTION_CHANGE } from './offline-fork';
import ReadMessageReducer from './conversations/readMessage';
import LogoutReducer from './auth/logout';
import SendVerificationEmailReducer from './auth/sendVerificationEmail';
import GetClassmatesReducer from './admin/getClassmates';
import ReviewProfileReducer from './admin/reviewProfile';
import type { ReviewProfile_Action } from './admin/reviewProfile';
import type {
  Artist,
  Artist_Action,
  ReduxState as Artist_ReduxState
} from './artists';
import {
  DefaultReduxState as Artist_DefaultReduxState,
  Reducers as Artist_Reducers
} from './artists';
import type { Yak_Action, ReduxState as Yak_ReduxState } from './yaks';
import {
  DefaultReduxState as Yak_DefaultReduxState,
  Reducers as Yak_Reducers
} from './yaks';
import type {
  ReduxState as LaunchDate_ReduxState,
  Action as LaunchDate_Action
} from './meta/launchDate';
import {
  DefaultReduxState as LaunchDate_DefaultReduxState,
  Reducers as LaunchDate_Reducers
} from './meta/launchDate';

export type Scene = 'smash' | 'social' | 'stone';
export const Scenes: Scene[] = ['smash', 'social', 'stone'];

// For global popups
export type PopupCode = 'UNAUTHORIZED' | 'SERVER_ERROR' | 'EXPIRED_VERIFY_CODE';
export type BottomToastCode =
  | 'SAVE_SETTINGS__SUCCESS'
  | 'SAVE_SETTINGS__FAILURE'
  | 'SAVE_PROFILE__SUCCESS'
  | 'SAVE_PROFILE__FAILURE'
  | 'UPLOAD_PHOTO_FAILURE'
  | 'DELETE_PHOTO_FAILURE'
  | 'UNMATCH_FAILURE';
export type BottomToast = {
  uuid: string,
  code: ?BottomToastCode
};

export type NewMatchToastCode = 'NEW_MATCH';
export type NewMatchToast = {
  uuid: string,
  code: NewMatchToastCode,
  clientInitiatedMatch: boolean,
  userId: number,
  scene: Scene
};

export type NewMessageToastCode = 'NEW_MESSAGE';
export type NewMessageToast = {
  uuid: string,
  code: NewMessageToastCode,
  displayName: string
};

type InitialToast = {
  uuid: string,
  code: 'INITIAL'
};

export type TopToastCode = NewMessageToastCode | NewMatchToastCode;
export type TopToast = NewMatchToast | NewMessageToast | InitialToast;

// /////////////
// USER TYPES:
// /////////////
export type Genders = {
  man: boolean,
  woman: boolean,
  nonBinary: boolean
};

type ActiveScenes = {
  smash: boolean,
  social: boolean,
  stone: boolean
};

export type UserSettings = {
  identifyAsGenders: Genders,
  lookingForGenders: Genders,
  activeScenes: ActiveScenes,
  notificationsEnabled: boolean,
  expoPushToken: ?string,
  isAdmin: boolean,
  canBeActiveInScenes: boolean
};

export type ProfileFields = {|
  displayName: string,
  birthday: string,
  bio: string,
  isTeamMember: boolean,
  postgradRegion: ?string,
  freshmanDorm: ?string,
  springFlingAct: ?string, // THIS IS THE ID WE USE TO SET IT
  springFlingActArtist: ?Artist // THIS IS ANYTHING WE RENDER
|};

export type UserProfile = {|
  fields: ProfileFields,
  photoUuids: string[]
|};

type SceneMatchTimes = {|
  smash: ?string,
  social: ?string,
  stone: ?string
|};

type BaseUser = {| userId: number, profile: UserProfile |};
export type Client = {| ...BaseUser, settings: UserSettings |};
export type Candidate = BaseUser;

// Eventually we want BaseUser to be profileId also. To not break EVERYTHING, we do this increntally.
// TODO: use normalizr to change profile and mostRecentMessage to profileId and mostRecentMessageId
type BaseUserNew = {| userId: number, profile: number |};
export type Match = {|
  ...BaseUserNew,
  mostRecentMessage: number,
  scenes: SceneMatchTimes,
  conversationIsRead: boolean,
  newMatch: boolean
|};

export type Matches = {
  [Id: number]: Match
};

export type SceneCandidateIds = {|
  smash: number[],
  social: number[],
  stone: number[]
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

// For normalizer:
const ConfirmedMessageSchema = new schema.Entity(
  'messages',
  {},
  {
    idAttribute: 'messageId'
  }
);

// Specical case so we can know who sent it
const MostRecentMessageSchema = new schema.Entity(
  'mostRecentMessages',
  {},
  {
    idAttribute: 'messageId',
    processStrategy: (value, parent) => {
      return { ...value, otherUserId: parent.userId };
    }
  }
);

// NOTE: because profiles have their ID's in the parent object,
// we assume that when accessing the object we can access parent.userId.
const ProfileSchema = new schema.Entity(
  'profiles',
  {},
  {
    idAttribute: (__, parent) => parent.userId
  }
);

const CanidateSchema = new schema.Entity(
  'candidates',
  {
    profile: ProfileSchema
  },
  {
    idAttribute: 'userId'
  }
);

const MatchSchema = new schema.Entity(
  'matches',
  {
    profile: ProfileSchema,
    mostRecentMessage: MostRecentMessageSchema
  },
  { idAttribute: 'userId' }
);

// We add these unconfrimed uuid's so that we can handle messages being sent from client side.
// For those retrieved from server, we ignore this field.
export type Message = {|
  ...ServerMessage,
  unconfirmedMessageUuid: string
|};

// Extended type because in context we don't know who it is sent to.
type MostRecentMessage = {|
  ...Message,
  otherUserId: number
|};

/**
 * Associates a message with the time the message was read by the user the message was sent to.
 */
export type ReadReceipt = {|
  messageId: number,
  readAtTimestamp: string
|};

type GiftedChatUser = {|
  _id: string,
  name: string
|};

export type GiftedChatMessage = {|
  _id: string,
  text: string,
  createdAt: ?Date | number, // optional & accepts ducktyped date numbers
  user?: GiftedChatUser,
  system?: boolean,
  sent: boolean,
  failed: boolean,
  received?: boolean,
  displayLarge?: boolean
|};

// TODO: enable if needed. This is a conceptual type.
// type User = Client | Candidate;

// --------- //
// MESSAGES:
// --------- //

// Follows: https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape

// Keyed by server ID
export type ConfirmedMessages = {|
  byId: {|
    [Id: number]: Message
  |},
  inOrderIds: number[], // Id's we know are in correct order
  outOfOrderIds: number[] // Id's we have but are unsure of order / know there's a problem, and will fix on next getConversation
|};

//  Stored seperately than conversations because this is updated via socket primarily,
//  so is much safer to use if seperated outside of redux state controlled by api actions.
//  Can also easily be converted to a slice reducer because of this abstraction.
/**
 * Associates a user with the most recent `ReadReceipt` of that user.
 * If the conversation has never been read than the ReadReceipt is null.
 */
export type ReadReceipts = {
  [userId: number]: ?ReadReceipt
};

/**
 * Used so that we don't send a readMessage API call if we've already confirmed we've sent one.
 */
export type ReadMessages = { [userId: number]: ?ReadReceipt };

// Keyed by client generated ID. Fine, because client only
// has unconfirmedMessages they generated ID's for then.
// These are the messages that only exist client side:
// those in progress being sent, and those that failed to send.
type UnconfirmedMessages = {|
  byId: {
    [UUID: string]: GiftedChatMessage
  },
  allIds: string[], // all UUIDS in order,
  inProgressIds: string[], // messages being sent UUIDS in order
  failedIds: string[] // messages failed to send in order they failed
|};

type ConfirmedConversations = { [userId: number]: ConfirmedMessages };
type UnconfirmedConversations = { [userId: number]: UnconfirmedMessages };

// --------- //

export type InProgress = {|
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
  blockUser: boolean,
  reportUser: boolean,
  unmatch: boolean,
  sendFeedback: boolean,
  getClassmates: boolean,

  sendMessage: { [userId: number]: { [messageUuid: string]: boolean } },
  readMessage: { [userId: number]: { [messageId: number]: boolean } },

  // map of userID's to conversation fetches in progress
  getConversation: { [userId: number]: boolean },

  getProfile: { [userId: number]: boolean },

  reviewProfile: { [userId: number]: boolean }
|};

export type ApiResponse = {|
  sendVerificationEmail: ?SendVerificationEmail_Response,
  login: ?Login_Response,
  logoutSuccess: ?boolean,
  createUserSuccess: ?boolean, // So we can determine whether onboarding has been succesful
  blockUserSuccess: ?boolean,
  reportUserSuccess: ?boolean,
  sendFeedbackSuccess: ?boolean
|};

// TODO: seperate state into profile, meta, API responses, etc.
export type ReduxState = {|
  network: { isConnected: boolean },

  numBadges: null | number, // one of the few numbers in the app that quite frequently IS 0, so !!number is inacurate, so we don't have a maybe type.

  // app data:
  client: ?Client,
  token: ?string,

  // action states:
  authLoaded: boolean,
  appLoaded: boolean,
  onboardingCompleted: boolean,

  inProgress: InProgress,

  // Unfortunately, we really need case analysis for a few calls that we
  // trigger different component states for different errors.
  response: ApiResponse,

  sceneCandidateIds: SceneCandidateIds,
  excludeSceneCandidateIds: ExcludeSceneCandidateIds,

  // map of userID's to messages
  confirmedConversations: ConfirmedConversations,

  // Located outside of inProgress for convienence,
  // because of how different this works compared to other reducers
  unconfirmedConversations: UnconfirmedConversations,

  readReceipts: ReadReceipts,
  readMessages: ReadMessages,

  // map of all profiles loaded
  profiles: { [userId: number]: UserProfile },

  matchesById: Matches,
  messagedMatchIds: ?(number[]),
  unmessagedMatchIds: ?(number[]),

  // Global Error Popup
  popupErrorCode: ?PopupCode,

  // Toast
  bottomToast: BottomToast,
  topToast: TopToast,

  // Classmates (ADMIN)
  classmateIds: number[],
  classmatesById: { [number]: ServerClassmate },
  artists: Artist_ReduxState,
  launchDate: LaunchDate_ReduxState,
  yaks: Yak_ReduxState
|};

export type Action =
  | LoginInitiated_Action
  | LoginCompleted_Action
  | LoginFailed_Action
  | Logout_Action
  | LoadAuthInitiated_Action
  | LoadAuthCompleted_Action
  | LoadAppInitiated_Action
  | LoadAppCompleted_Action
  | LoadAppFailed_Action
  | CreateUserInitiated_Action
  | CreateUserCompleted_Action
  | CreateUserFailed_Action
  | SendVerificationEmail_Action
  | SaveProfileFieldsInitiated_Action
  | SaveProfileFieldsCompleted_Action
  | SaveProfileFieldsFailed_Action
  | Unauthorized_Action
  | ServerError_Action
  | NetworkError_Action
  | Terminated_Action
  | UploadPhotoCompleted_Action
  | UploadPhotoInitiated_Action
  | UploadPhotoFailed_Action
  | DeletePhotoCompleted_Action
  | DeletePhotoInitiated_Action
  | DeletePhotoFailed_Action
  | SaveSettingsInitiated_Action
  | SaveSettingsCompleted_Action
  | SaveSettingsFailed_Action
  | GetSceneCandidatesInitiated_Action
  | GetSceneCandidatesCompleted_Action
  | GetMatchesInitiated_Action
  | GetMatchesCompleted_Action
  | GetMatchesFailed_Action
  | JudgeSceneCandidateInitiated_Action
  | JudgeSceneCandidateCompleted_Action
  | GetConversationInitiated_Action
  | GetConversationCompleted_Action
  | SendMessageInitiated_Action
  | SendMessageCompleted_Action
  | SendMessageFailed_Action
  | ReadMessage_Action
  | SummonPopup_Action
  | DismissPopup_Action
  | NewMessageInitiated_Action
  | NewMessageCompleted_Action
  | NewMatchInitiated_Action
  | NewMatchCompleted_Action
  | ReadReceiptUpdateInitiated_Action
  | ReadReceiptUpdateCompleted_Action
  | CancelFailedMessage_Action
  | BlockUserInitiated_Action
  | BlockUserCompleted_Action
  | BlockUserFailed_Action
  | ReportUserInitiated_Action
  | ReportUserCompleted_Action
  | ReportUserFailed_Action
  | UnmatchInitiated_Action
  | UnmatchCompleted_Action
  | UnmatchFailed_Action
  | NetworkChange_Action
  | SendFeedbackInitiated_Action
  | SendFeedbackCompleted_Action
  | SendFeedbackFailed_Action
  | GetClassmates_Action
  | Artist_Action
  | LaunchDate_Action
  | GetProfileInitiated_Action
  | GetProfileCompleted_Action
  | GetProfileFailed_Action
  | ReviewProfile_Action
  | Yak_Action;

export type GetState = () => ReduxState;

// eslint-disable-next-line no-use-before-define
export type Dispatch = ReduxDispatch<Action> & Thunk<Action>;
export type Thunk<A> = ((Dispatch, GetState) => Promise<void> | void) => A;

export const initialState: ReduxState = {
  network: { isConnected: true }, // start with an immediate call to check, we don't want to start with the offline screen.
  numBadges: null, // indicate we have not yet determined how many badges
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
    sendMessage: {},
    readMessage: {},
    blockUser: false,
    reportUser: false,
    unmatch: false,
    sendFeedback: false,
    getClassmates: false,
    getProfile: {},
    reviewProfile: {}
  },
  response: {
    sendVerificationEmail: null,
    login: null,
    logoutSuccess: null,
    createUserSuccess: null,
    blockUserSuccess: null,
    reportUserSuccess: null,
    sendFeedbackSuccess: null
  },
  onboardingCompleted: false,
  sceneCandidateIds: {
    smash: [],
    social: [],
    stone: []
  },
  excludeSceneCandidateIds: {
    smash: [],
    social: [],
    stone: []
  },
  confirmedConversations: {},
  unconfirmedConversations: {},
  readReceipts: {},
  readMessages: {},
  profiles: {},

  // before loaded
  matchesById: {},
  messagedMatchIds: null,
  unmessagedMatchIds: null,

  // Global Error Popup
  popupErrorCode: null,

  // Toasts
  bottomToast: {
    uuid: '0',
    code: null
  },
  topToast: {
    uuid: '0',
    code: 'INITIAL'
  },
  classmateIds: [],
  classmatesById: {},
  artists: Artist_DefaultReduxState,
  launchDate: LaunchDate_DefaultReduxState,
  yaks: Yak_DefaultReduxState
};

// To deal with flow not liking typing generics at run time...
// https://stackoverflow.com/questions/49949203/how-to-explicitly-pass-type-arguments-to-generic-functions-in-flow
function normalizeMatches(
  matches: ServerMatch[]
): {
  result: number[],
  entities: {|
    matches: { [userId: number]: Match },
    mostRecentMessages: { [userId: number]: MostRecentMessage },
    profiles: { [userId: number]: UserProfile }
  |}
} {
  return normalize(matches, [MatchSchema]);
}

function normalizeCandidates(
  canidates: ServerCandidate[]
): {
  result: number[],
  entities: {|
    profiles: { [userId: number]: UserProfile },

    // Pretty useless data we happen to get. Profile Id and User Id are the same thing, and we don't really use this at all.
    candidates: { [userId: number]: { profileId: number, userId: number } }
  |}
} {
  return normalize(canidates, [CanidateSchema]);
}

function updateMostRecentMessage(
  state: ReduxState,
  matchId: number,
  messageId: number,
  markConversationUnread: ?boolean
) {
  // Assert that these are neither null nor void
  const { unmessagedMatchIds = [], messagedMatchIds = [] } = state;
  const unmessaged = unmessagedMatchIds === null ? [] : unmessagedMatchIds;
  const messaged = messagedMatchIds === null ? [] : messagedMatchIds;

  // If a new message comes in before the match is loaded then don't update.
  // The messages will be fetched DURING the fetch of the match.
  const matchLoaded = matchId in state.matchesById;
  if (!matchLoaded) {
    // esentially just return the default substate.
    // (Damn, imagine having slice reducers)
    return {
      unmessagedMatchIds: unmessaged,
      messagedMatchIds: messaged,
      matchesById: state.matchesById
    };
  }
  const prevMatch = state.matchesById[matchId];
  const conversationIsRead =
    markConversationUnread === true
      ? false
      : prevMatch && prevMatch.conversationIsRead === true;
  const match = {
    ...state.matchesById[matchId],
    mostRecentMessage: messageId,
    conversationIsRead
  };

  return {
    unmessagedMatchIds: unmessaged.filter(id => {
      return id !== matchId;
    }),
    messagedMatchIds: [
      matchId,
      ...messaged.filter(id => {
        return id !== matchId;
      })
    ],
    matchesById: {
      ...state.matchesById,
      [matchId]: match
    }
  };
}

function updateConfirmedConversation(
  state: ReduxState,
  userId: number,
  newMessagesMap: { [messageId: number]: Message } = {},
  messageIds: number[] = [],
  previousMessageId: ?number // if this is the first time this is void
): ConfirmedConversations {
  const { byId = {}, inOrderIds = [], outOfOrderIds = [] } =
    state.confirmedConversations[userId] || {};

  let newInOrderIds;
  let newOutOfOrderIds;
  const prevMessageIndex = inOrderIds.indexOf(previousMessageId);

  // Case 1 -- GOOD STATE
  // Not the first message, and we have the previous message in our inOrderIds
  if (previousMessageId && prevMessageIndex !== -1) {
    // We could get in a state where
    //    inOrderIds = [1, 2, 3, 4, 5]
    //    messageIds = [5, 6, 7]
    // In that example, previousMessageId should be 4.
    newInOrderIds = inOrderIds
      .slice(0, prevMessageIndex + 1) // off by one error to preserve previous message
      .concat(messageIds);
    newOutOfOrderIds = outOfOrderIds.filter(id => !messageIds.includes(id));
  }

  // Case 2 -- BAD STATE
  // Not the first message, but we DON'T have the previous message in our inOrderIds
  // This means something has gone wrong.
  if (previousMessageId && prevMessageIndex === -1) {
    newInOrderIds = inOrderIds;

    // Note that this is kinda INVERSED from the above.
    // That's because if somehow we got back messages we already are keeping track of, we need to make sure
    // we preserve the previous order, otherwise the messages will swap locations.
    newOutOfOrderIds = outOfOrderIds.concat(
      messageIds.filter(id => !outOfOrderIds.includes(id))
    );
  }

  // Case 3 -- BAD STATE
  // The first message, and we have the previous message in our inOrderIds.
  // This is a really weird case. It indicates something has MASSIVELY screwed up,
  // as on the api request we had more messages than we do now.
  // To handle this as nicely as possible, we throw ALL messages into outOfOrder.
  // That way, the next getConversation should see that there is no inOrderIds, and grab all Ids.
  if (!previousMessageId && prevMessageIndex !== -1) {
    newInOrderIds = [];
    const allPreviousIds = inOrderIds.concat(outOfOrderIds);
    const newIdsWithoutDuplicates = messageIds.filter(
      id => !allPreviousIds.includes(id)
    );
    newOutOfOrderIds = allPreviousIds.concat(newIdsWithoutDuplicates);
  }

  // Case 4 -- GOOD STATE
  // The first message, and we don't have the previous message in our inOrderIds.
  // This is typically on:
  //    a) the first load of a conversation,
  //    b) a reset load of the conversation, or
  //    c) on an initial message send / recieve.

  // NOTE: if outOfOrderIds contains elements NOT in messageIds, these are lost.
  // However, as this is a clean wipe we should use this as the messaging point of truth.
  if (!previousMessageId && prevMessageIndex === -1) {
    newInOrderIds = messageIds;
    newOutOfOrderIds = [];
  }

  return {
    ...state.confirmedConversations,
    [userId]: {
      byId: {
        ...byId,
        ...newMessagesMap
      },
      inOrderIds: newInOrderIds,
      outOfOrderIds: newOutOfOrderIds
    }
  };
}

function updateMostRecentConversations(
  state: ReduxState,
  mostRecentMessages: { [userId: number]: MostRecentMessage }
): ConfirmedConversations {
  const messageIds = Object.keys(mostRecentMessages);
  const confirmedConversations = messageIds.reduce((conversations, id) => {
    const messageId = parseInt(id, 10);
    const { otherUserId } = mostRecentMessages[messageId];
    const { byId = {}, inOrderIds = [], outOfOrderIds = [] } =
      conversations[otherUserId] || {};
    return {
      ...conversations,
      [otherUserId]: {
        byId: {
          ...byId,
          [messageId]: mostRecentMessages[messageId]
        },
        inOrderIds,
        outOfOrderIds
      }
    };
  }, state.confirmedConversations);

  return confirmedConversations;
}

// Ugh, again, just a fake slice reducer
function updateReadReceipts(
  state: ReduxState,
  userId: number,
  serverReadReceipt: ?ServerReadReceipt
): ReadReceipts {
  const readReceipt = serverReadReceipt && {
    messageId: serverReadReceipt.messageId,
    readAtTimestamp: serverReadReceipt.timestamp
  };

  return {
    ...state.readReceipts,
    [userId]: readReceipt
  };
}

/**
 * Clear the candidates from scenes no longer enabled.
 */
function resetInactiveScenes(
  state: ReduxState,
  activeScenes: ActiveScenes
): {
  excludeSceneCandidateIds: ExcludeSceneCandidateIds,
  sceneCandidateIds: SceneCandidateIds
} {
  return {
    excludeSceneCandidateIds: {
      smash: activeScenes.smash ? state.excludeSceneCandidateIds.smash : [],
      social: activeScenes.social ? state.excludeSceneCandidateIds.social : [],
      stone: activeScenes.stone ? state.excludeSceneCandidateIds.stone : []
    },
    sceneCandidateIds: {
      smash: activeScenes.smash ? state.sceneCandidateIds.smash : [],
      social: activeScenes.social ? state.sceneCandidateIds.social : [],
      stone: activeScenes.stone ? state.sceneCandidateIds.stone : []
    }
  };
}

export default function rootReducer(
  state: ReduxState = initialState,
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

    // reset to initial state, besides responses to this action.
    case 'LOGIN_COMPLETED': {
      const { response } = action.payload;
      return {
        ...initialState,
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

    case 'LOGIN_FAILED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          login: false
        }
      };
    }

    case 'LOGOUT__INITIATED': {
      return LogoutReducer.initiate(state, action);
    }

    case 'LOGOUT__COMPLETED': {
      return LogoutReducer.complete(state, action);
    }

    case 'LOGOUT__FAILED': {
      return LogoutReducer.fail(state, action);
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

    case 'LOAD_APP__FAILED': {
      return {
        ...state,
        appLoaded: false,
        inProgress: {
          ...state.inProgress,
          loadApp: false
        }
      };
    }

    case 'LOAD_APP__COMPLETED': {
      const {
        profile,
        settings,
        onboardingCompleted,
        launchDateStatus
      } = action.payload;
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
        onboardingCompleted,

        // Ideally a reducer should not touch launchDate slice, but loadApp is special
        launchDate: {
          ...state.launchDate,
          status: launchDateStatus
        }
      };
    }

    case 'CREATE_PROFILE_AND_SETTINGS__INITIATED': {
      return {
        ...state,
        response: {
          ...state.response,
          createUserSuccess: null
        },
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
        },
        response: {
          ...state.response,
          createUserSuccess: true
        }
      };
    }

    case 'CREATE_PROFILE_AND_SETTINGS__FAILED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          createUser: false
        },
        response: {
          ...state.response,
          createUserSuccess: false
        }
      };
    }

    case 'SEND_VERIFICATION_EMAIL__INITIATED': {
      return SendVerificationEmailReducer.initiate(state, action);
    }

    case 'SEND_VERIFICATION_EMAIL__COMPLETED': {
      return SendVerificationEmailReducer.complete(state, action);
    }

    case 'SEND_VERIFICATION_EMAIL__FAILED': {
      return SendVerificationEmailReducer.fail(state, action);
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
      const bottomToast = {
        uuid: uuidv4(),
        code: 'SAVE_PROFILE__SUCCESS'
      };
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
        },
        bottomToast
      };
    }

    case 'UNAUTHORIZED': {
      return state;
    }

    case 'SERVER_ERROR': {
      return state;
    }

    case 'NETWORK_ERROR': {
      return state;
    }

    case 'TERMINATED': {
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
            photoUuids: action.payload.photoUuids
          }
        }
      };
    }

    case 'UPLOAD_PHOTO__FAILED': {
      const bottomToast = {
        uuid: uuidv4(),
        code: 'UPLOAD_PHOTO_FAILURE'
      };
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          uploadPhoto: false
        },
        bottomToast
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

    case 'DELETE_PHOTO__FAILED': {
      const bottomToast = {
        uuid: uuidv4(),
        code: 'DELETE_PHOTO_FAILURE'
      };
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          deletePhoto: false
        },
        bottomToast
      };
    }

    case 'DELETE_PHOTO__COMPLETED': {
      if (!state.client) {
        throw new Error('User null in reducer for DELETE_PHOTO__COMPLETED');
      }
      const { photoUuids } = action.payload;
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
            photoUuids
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

    // Appends new Ids to both the SceneCandidates array (the list of all candidates)
    // and to the ExcludeSceneCandidates array (the list of candidates yet to have been confirmed judged by the server)
    case 'GET_SCENE_CANDIDATES__COMPLETED': {
      const { candidates, scene } = action.payload;

      const { result: newIds, entities: normalizedData } = normalizeCandidates(
        candidates
      );
      const { profiles = {} } = normalizedData;
      const oldIds = state.sceneCandidateIds[scene];
      const oldExcludeIds = state.excludeSceneCandidateIds[scene];

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getSceneCandidates: {
            ...state.inProgress.getSceneCandidates,
            [scene]: false
          }
        },
        profiles: {
          ...state.profiles,
          ...profiles
        },
        sceneCandidateIds: {
          ...state.sceneCandidateIds,
          [scene]: [...oldIds, ...newIds]
        },
        excludeSceneCandidateIds: {
          ...state.excludeSceneCandidateIds,
          [scene]: [...oldExcludeIds, ...newIds]
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

    case 'GET_MATCHES__COMPLETED': {
      const { payload: serverMatches } = action;

      const { result: orderedIds, entities: normalizedData } = normalizeMatches(
        serverMatches
      );

      const {
        matches = {},
        mostRecentMessages = {},
        profiles = {}
      } = normalizedData;

      const numBadges = serverMatches.reduce(
        (n, m) => (m.conversationIsRead ? n : n + 1),
        0
      );

      const [unmessagedMatchIds, messagedMatchIds] = _.partition(
        orderedIds,
        (id: number) => {
          const match = matches[id];
          return match && match.newMatch;
        }
      );

      const confirmedConversations = updateMostRecentConversations(
        state,
        mostRecentMessages
      );

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getMatches: false
        },
        confirmedConversations,
        matchesById: matches,
        profiles: {
          ...state.profiles,
          ...profiles
        },
        messagedMatchIds,
        unmessagedMatchIds,
        numBadges
      };
    }

    case 'GET_MATCHES__FAILED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getMatches: false
        }
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
      const { candidateUserId: judgedId, scene } = action.payload;
      if (state.excludeSceneCandidateIds[scene].indexOf(judgedId) === -1) {
        throw new Error(
          'Judged Candidate does not appear in reduxState.excludeSceneCandidateIds'
        );
      }
      return state;
    }

    case 'SAVE_SETTINGS__COMPLETED': {
      if (!state.client) {
        throw new Error('User null in reducer for SAVE_SETTINGS__COMPLETED');
      }
      const { disableToast } = action.meta;
      const settings = action.payload;
      const bottomToast = disableToast
        ? state.bottomToast
        : {
            uuid: uuidv4(),
            code: 'SAVE_SETTINGS__SUCCESS'
          };

      const { activeScenes } = settings;
      const {
        excludeSceneCandidateIds,
        sceneCandidateIds
      } = resetInactiveScenes(state, activeScenes);

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveSettings: false
        },
        client: {
          ...state.client,
          settings
        },
        bottomToast,
        excludeSceneCandidateIds,
        sceneCandidateIds
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
      const {
        userId,
        messages,
        previousMessageId,
        readReceipt
      } = action.payload;
      //  TODO: create helper function to type return value
      const { result: orderedIds, entities } = normalize(messages, [
        ConfirmedMessageSchema
      ]);

      const confirmedConversations = updateConfirmedConversation(
        state,
        userId,
        entities.messages,
        orderedIds,
        previousMessageId
      );

      const readReceipts = updateReadReceipts(state, userId, readReceipt);

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getConversation: {
            ...state.inProgress.getConversation,
            [userId]: false
          }
        },
        readReceipts,
        confirmedConversations
      };
    }

    case 'SEND_MESSAGE__INITIATED': {
      const { receiverUserId, giftedChatMessage } = action.payload;

      // Initialize to an empty object in case this is the first time sending a message
      // for a fresh store so that we can destructure with defaults.
      const unsentMessages =
        state.unconfirmedConversations[receiverUserId] || {};
      const {
        byId = {},
        allIds = [],
        inProgressIds = [],
        failedIds = []
      } = unsentMessages;
      const uuid = giftedChatMessage._id;

      // If we are resending a message, we want to move the Id to inProgress.
      const newFailedIds = failedIds.filter(i => i !== uuid);

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
            allIds: [...allIds, uuid],
            inProgressIds: [...inProgressIds, uuid],
            failedIds: newFailedIds
          }
        }
      };
    }

    // Remove Id from in progress messages, add to failed messages.
    case 'SEND_MESSAGE__FAILED': {
      const { receiverUserId, messageUuid: uuid } = action.payload;

      const unsentMessages =
        state.unconfirmedConversations[receiverUserId] || {};
      const { inProgressIds = [], failedIds = [] } = unsentMessages;

      const newInProgressIds = inProgressIds.filter(i => i !== uuid);
      const newFailedIds = [...failedIds, uuid];

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
        unconfirmedConversations: {
          ...state.unconfirmedConversations,
          [receiverUserId]: {
            ...unsentMessages,
            inProgressIds: newInProgressIds,
            failedIds: newFailedIds
          }
        }
      };
    }

    case 'SEND_MESSAGE__COMPLETED': {
      const { receiverUserId, previousMessageId, message } = action.payload;
      const { messageId: id, unconfirmedMessageUuid: uuid } = message;

      // remove the sent message from the unsent list
      const {
        inProgressIds = [],
        allIds = []
      } = state.unconfirmedConversations[receiverUserId];
      const newInProgressIds = inProgressIds.filter(i => i !== uuid);
      const newAllIds = allIds.filter(i => i !== uuid);

      const confirmedConversations = updateConfirmedConversation(
        state,
        receiverUserId,
        { [id]: message },
        [id],
        previousMessageId
      );

      const {
        unmessagedMatchIds,
        messagedMatchIds,
        matchesById
      } = updateMostRecentMessage(state, receiverUserId, id, false);

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
        confirmedConversations,
        // Must have values because initialized on Send Message Initiate
        // TODO: consider deleting the message from unconfirmed byIds. (For invarients?)
        unconfirmedConversations: {
          ...state.unconfirmedConversations,
          [receiverUserId]: {
            ...state.unconfirmedConversations[receiverUserId],
            allIds: newAllIds,
            inProgressIds: newInProgressIds
          }
        },
        unmessagedMatchIds,
        messagedMatchIds,
        matchesById
      };
    }

    // TODO: trivially make these their own slice reducer
    case 'SUMMON_POPUP': {
      const { code: popupErrorCode } = action.payload;
      return { ...state, popupErrorCode };
    }

    case 'DISMISS_POPUP': {
      return { ...state, popupErrorCode: null };
    }

    case 'READ_RECEIPT_UPDATE__INITIATED': {
      return state;
    }

    case 'READ_RECEIPT_UPDATE__COMPLETED': {
      const { readerUserId, readReceipt } = action.payload;
      const readReceipts = updateReadReceipts(state, readerUserId, readReceipt);
      return {
        ...state,
        readReceipts
      };
    }

    case 'NEW_MESSAGE__INITIATED': {
      return state;
    }

    case 'NEW_MESSAGE__COMPLETED': {
      const {
        senderProfile,
        senderUserId,
        message,
        previousMessageId
      } = action.payload;

      const confirmedConversations = updateConfirmedConversation(
        state,
        senderUserId,
        { [message.messageId]: message },
        [message.messageId],
        previousMessageId
      );

      const {
        unmessagedMatchIds,
        messagedMatchIds,
        matchesById
      } = updateMostRecentMessage(state, senderUserId, message.messageId, true);

      const { conversationIsRead } = state.matchesById[senderUserId] || {
        conversationIsRead: false
      };

      const numBadges = state.numBadges + (conversationIsRead ? 1 : 0);

      return {
        ...state,
        topToast: {
          uuid: uuidv4(),
          code: 'NEW_MESSAGE',
          displayName: senderProfile.fields.displayName
        },
        confirmedConversations,
        unmessagedMatchIds,
        messagedMatchIds,
        matchesById,
        numBadges
      };
    }

    case 'NEW_MATCH__INITIATED': {
      return state;
    }

    case 'NEW_MATCH__COMPLETED': {
      const { scene, clientInitiatedMatch, match } = action.payload;
      const userId = match.userId;

      // Update our matchesById with the new match,
      // so that we can navigate to it.
      const { entities } = normalizeMatches([match]);
      const { matches = {} } = entities;

      // There's a special quirk here for when a new match occurs on a previous match WITH a message--
      // they will still be in the 'messaged' list. Ideally we would have formed GET_MATCHES out of a
      // bunch of UPDATE_MATCH, and this would be an UPDATE_MATCH. However, as a quick fix for a bug,
      // we ensure here to populate the messages map with the new message.

      const { byId = {}, inOrderIds = [], outOfOrderIds = [] } =
        state.confirmedConversations[userId] || {};

      const { mostRecentMessage } = match;

      const newConfirmedConversation = {
        byId: {
          ...byId,
          // Not a great way to do this.
          // This is technically a ServerMessage, not a Message.
          // We don't care because the difference does not matter to a confirmedMessage.
          [mostRecentMessage.messageId]: mostRecentMessage
        },
        inOrderIds,
        outOfOrderIds
      };

      return {
        ...state,
        topToast: {
          uuid: uuidv4(),
          code: 'NEW_MATCH',
          clientInitiatedMatch,
          userId,
          scene
        },
        matchesById: {
          ...state.matchesById,
          ...matches
        },
        confirmedConversations: {
          ...state.confirmedConversations,
          [userId]: newConfirmedConversation
        }
      };
    }

    case 'SAVE_SETTINGS__FAILED': {
      const { disableToast } = action.meta;
      const bottomToast = disableToast
        ? state.bottomToast
        : {
            uuid: uuidv4(),
            code: 'SAVE_SETTINGS__FAILURE'
          };
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveSettings: false
        },
        bottomToast
      };
    }

    case 'SAVE_PROFILE__FAILED': {
      const bottomToast = {
        uuid: uuidv4(),
        code: 'SAVE_PROFILE__FAILURE'
      };
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          saveProfile: false
        },
        bottomToast
      };
    }

    case 'CANCEL_FAILED_MESSAGE': {
      const { receiverUserId, failedMessageUuid } = action.payload;
      const unsentMessages =
        state.unconfirmedConversations[receiverUserId] || {};
      const { failedIds = [] } = unsentMessages;
      return {
        ...state,
        unconfirmedConversations: {
          ...state.unconfirmedConversations,
          [receiverUserId]: {
            ...unsentMessages,
            failedIds: failedIds.filter(i => {
              return i !== failedMessageUuid;
            })
          }
        }
      };
    }

    case 'REPORT_USER__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          reportUser: true
        },
        response: {
          ...state.response,
          reportUserSuccess: null
        }
      };
    }

    case 'REPORT_USER__COMPLETED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          reportUser: false
        },
        response: {
          ...state.response,
          reportUserSuccess: true
        }
      };
    }

    case 'REPORT_USER__FAILED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          reportUser: false
        },
        response: {
          ...state.response,
          reportUserSuccess: false
        }
      };
    }

    case 'UNMATCH__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          unmatch: true
        }
      };
    }

    case 'UNMATCH__COMPLETED': {
      const { matchId } = action.payload;
      const updatedMatchesById = state.matchesById;
      delete updatedMatchesById[matchId];

      if (
        state.messagedMatchIds === null ||
        state.messagedMatchIds === undefined
      ) {
        throw new Error('messagedMatchIds is null or undefined');
      }

      const newMessagedMatchIds = state.messagedMatchIds.filter(
        id => id !== matchId
      );

      if (
        state.unmessagedMatchIds === null ||
        state.unmessagedMatchIds === undefined
      ) {
        throw new Error('unmessagedMatchIds is null or undefined');
      }

      const newUnmessagedMatchIds = state.unmessagedMatchIds.filter(
        id => id !== matchId
      );

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          unmatch: false
        },
        matchesById: updatedMatchesById,
        messagedMatchIds: newMessagedMatchIds,
        unmessagedMatchIds: newUnmessagedMatchIds
      };
    }

    case 'UNMATCH__FAILED': {
      const bottomToast = {
        uuid: uuidv4(),
        code: 'UNMATCH_FAILURE'
      };
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          unmatch: false
        },
        bottomToast
      };
    }

    case 'BLOCK_USER__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          blockUser: true
        },
        response: {
          ...state.response,
          blockUserSuccess: null
        }
      };
    }

    case 'BLOCK_USER__COMPLETED': {
      const { userId } = action.payload;
      const updatedMatchesById = state.matchesById;
      delete updatedMatchesById[userId];

      if (
        state.messagedMatchIds === null ||
        state.messagedMatchIds === undefined
      ) {
        throw new Error('messagedMatchIds is null or undefined');
      }

      const newMessagedMatchIds = state.messagedMatchIds.filter(
        id => id !== userId
      );

      if (
        state.unmessagedMatchIds === null ||
        state.unmessagedMatchIds === undefined
      ) {
        throw new Error('unmessagedMatchIds is null or undefined');
      }

      // TODO: We need to filter out this user from sceneCandidateIds. This requires changes to the deck

      const newUnmessagedMatchIds = state.unmessagedMatchIds.filter(
        id => id !== userId
      );

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          blockUser: false
        },
        response: {
          ...state.response,
          blockUserSuccess: true
        },
        matchesById: updatedMatchesById,
        messagedMatchIds: newMessagedMatchIds,
        unmessagedMatchIds: newUnmessagedMatchIds
      };
    }

    case 'BLOCK_USER__FAILED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          blockUser: false
        },
        response: {
          ...state.response,
          blockUserSuccess: false
        }
      };
    }

    case 'SEND_FEEDBACK__INITIATED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendFeedback: true
        },
        response: {
          ...state.response,
          sendFeedbackSuccess: null
        }
      };
    }

    case 'SEND_FEEDBACK__COMPLETED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendFeedback: false
        },
        response: {
          ...state.response,
          sendFeedbackSuccess: true
        }
      };
    }

    case 'SEND_FEEDBACK__FAILED': {
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          sendFeedback: false
        },
        response: {
          ...state.response,
          sendFeedbackSuccess: false
        }
      };
    }

    // See offline-fork.js -- this allows us to use
    // react-native-offline at a flat level in our redux state.
    case CONNECTION_CHANGE: {
      return handleNetworkChange(state, action.payload);
    }

    case 'READ_MESSAGE__INITIATED': {
      return ReadMessageReducer.initiate(state, action);
    }

    case 'READ_MESSAGE__COMPLETED': {
      return ReadMessageReducer.complete(state, action);
    }

    case 'READ_MESSAGE__FAILED': {
      return ReadMessageReducer.fail(state, action);
    }

    case 'GET_CLASSMATES__INITIATED': {
      return GetClassmatesReducer.initiate(state, action);
    }

    case 'GET_CLASSMATES__COMPLETED': {
      return GetClassmatesReducer.complete(state, action);
    }

    case 'GET_CLASSMATES__FAILED': {
      return GetClassmatesReducer.fail(state, action);
    }
    case 'SEARCH_ARTISTS__INITIATED': {
      return {
        ...state,
        artists: Artist_Reducers.Search.initiate(state.artists, action)
      };
    }

    case 'SEARCH_ARTISTS__COMPLETED': {
      return {
        ...state,
        artists: Artist_Reducers.Search.complete(state.artists, action)
      };
    }

    case 'SEARCH_ARTISTS__FAILED': {
      return {
        ...state,
        artists: Artist_Reducers.Search.fail(state.artists, action)
      };
    }

    case 'CHECK_LAUNCH_DATE__INITIATED': {
      return {
        ...state,
        launchDate: LaunchDate_Reducers.CheckLaunchDate.initiate(
          state.launchDate,
          action
        )
      };
    }

    case 'CHECK_LAUNCH_DATE__COMPLETED': {
      return {
        ...state,
        launchDate: LaunchDate_Reducers.CheckLaunchDate.complete(
          state.launchDate,
          action
        )
      };
    }

    case 'CHECK_LAUNCH_DATE__FAILED': {
      return {
        ...state,
        launchDate: LaunchDate_Reducers.CheckLaunchDate.fail(
          state.launchDate,
          action
        )
      };
    }

    case 'GET_PROFILE__INITIATED': {
      const { userId } = action.payload;
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getProfile: {
            ...state.inProgress.getProfile,
            [userId]: true
          }
        }
      };
    }

    case 'GET_PROFILE__COMPLETED': {
      const { userId, profile: serverProflie } = action.payload;

      // These two types, UserProfile and ServerProfile,
      //  are the same, so we can coherce like this.
      const profile: UserProfile = serverProflie;

      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getProfile: {
            ...state.inProgress.getProfile,
            [userId]: false
          }
        },
        profiles: {
          ...state.profiles,
          [userId]: profile
        }
      };
    }

    case 'GET_PROFILE__FAILED': {
      const { userId } = action.payload;
      return {
        ...state,
        inProgress: {
          ...state.inProgress,
          getProfile: {
            ...state.inProgress.getProfile,
            [userId]: false
          }
        }
      };
    }

    case 'REVIEW_PROFILE__INITIATED': {
      return ReviewProfileReducer.initiate(state, action);
    }

    case 'REVIEW_PROFILE__COMPLETED': {
      return ReviewProfileReducer.complete(state, action);
    }

    case 'REVIEW_PROFILE__FAILED': {
      return ReviewProfileReducer.fail(state, action);
    }

    case 'GET_YAKS__INITIATED': {
      return {
        ...state,
        yaks: Yak_Reducers.Get.initiate(state.yaks, action)
      };
    }

    case 'GET_YAKS__COMPLETED': {
      return {
        ...state,
        yaks: Yak_Reducers.Get.complete(state.yaks, action)
      };
    }

    case 'GET_YAKS__FAILED': {
      return {
        ...state,
        yaks: Yak_Reducers.Get.fail(state.yaks, action)
      };
    }

    case 'VOTE_YAK__INITIATED': {
      return {
        ...state,
        yaks: Yak_Reducers.Vote.initiate(state.yaks, action)
      };
    }

    case 'VOTE_YAK__COMPLETED': {
      return {
        ...state,
        yaks: Yak_Reducers.Vote.complete(state.yaks, action)
      };
    }

    case 'VOTE_YAK__FAILED': {
      return {
        ...state,
        yaks: Yak_Reducers.Vote.fail(state.yaks, action)
      };
    }

    case 'POST_YAK__INITIATED': {
      return {
        ...state,
        yaks: Yak_Reducers.Post.initiate(state.yaks, action)
      };
    }

    case 'POST_YAK__COMPLETED': {
      return {
        ...state,
        yaks: Yak_Reducers.Post.complete(state.yaks, action)
      };
    }

    case 'POST_YAK__FAILED': {
      return {
        ...state,
        yaks: Yak_Reducers.Post.fail(state.yaks, action)
      };
    }

    case 'POST_YAK__FAILED_TOO_MANY': {
      return {
        ...state,
        yaks: Yak_Reducers.Post.fail_TOO_MANY_POSTS(state.yaks, action)
      };
    }

    case 'REPORT_YAK__INITIATED': {
      return {
        ...state,
        yaks: Yak_Reducers.Report.initiate(state.yaks, action)
      };
    }

    case 'REPORT_YAK__COMPLETED': {
      return {
        ...state,
        yaks: Yak_Reducers.Report.complete(state.yaks, action)
      };
    }

    case 'REPORT_YAK__FAILED': {
      return {
        ...state,
        yaks: Yak_Reducers.Report.fail(state.yaks, action)
      };
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (action: empty); // ensures we have handled all cases
      return state;
    }
  }
}
