// @flow

import type { Scene } from 'mobile/reducers/';

// Internally, we want to represent a lot of nested data pretty differently, using normalizer.
// Here we keep track of how the server represents the data we pass back so our parsers operate
// in a well typed way.

export type ServerProfile = {|
  fields: {|
    displayName: string,
    bio: string,
    birthday: string,
    postgradRegion: ?string,
    freshmanDorm: ?string
  |},
  photoUuids: string[]
|};

export type ServerBaseUser = {
  userId: number,
  profile: ServerProfile
};

export type ServerCandidate = ServerBaseUser;

// nullable timestamps
export type ServerScenes = {
  smash: ?string,
  social: ?string,
  stone: ?string
};

export type Sender = 'system' | 'client' | 'match';

export type ServerMessage = {|
  messageId: number,
  content: string,
  timestamp: string,
  sender: Sender
|};

export type ServerReadReceipt = {|
  messageId: number,
  timestamp: string
|};

export type ServerConversation = {|
  messages: ServerMessage[],
  readReceipt: ServerReadReceipt
|};

export type ServerMatch = ServerBaseUser & {
  scenes: ServerScenes,
  mostRecentMessage: ServerMessage,
  conversationIsRead: boolean,
  newMatch: boolean
};

// Type for Push Notifications

/**
 * Recieved in the `Data` field of a `Notification` corresponding to a New Match Push Notification
 */
export type NewMatch_PushNotificationData = {
  type: 'NEW_MATCH',
  payload: {
    scene: Scene,
    userId: number
  }
};

/**
 * Recieved in the `Data` field of a `Notification` corresponding to a New MessagePush Notification
 */
export type NewMessage_PushNotificationData = {
  type: 'NEW_MESSAGE',
  payload: {
    senderUserId: number
  }
};

/**
 * Message body for system messages.
 */
export type SystemMessage =
  | 'MATCHED_SOCIAL'
  | 'MATCHED_SMASH'
  | 'MATCHED_STONE';

// ADMIN:

export type Capabilities = {
  canBeSwipedOn: boolean,
  canBeActiveInScenes: boolean
};

type Admin = {
  id: number,
  utln: string
};

type ProfileReview = {
  type: 'PROFILE_REVIEW',
  reviewer: Admin,
  comment: string | null,
  capabilities: Capabilities
};

type AccountTermination = {
  type: 'ACCOUNT_TERMINATION',
  admin: Admin | 'server', // Null here means the server did it
  reason: string
};

type ProfileFieldsUpdate = {
  type: 'PROFILE_FIELDS_UPDATE',
  changedFields: ServerProfile // TODO: ensure this is correct - this may only hold changed fields
};

type ProfileNewPhoto = {
  type: 'PROFILE_NEW_PHOTO',
  photoUUID: string
};

type AccountUpdate =
  | ProfileReview
  | AccountTermination
  | ProfileFieldsUpdate
  | ProfileNewPhoto;

type AccountUpdateMeta = {
  timestamp: string,
  update: AccountUpdate
};

export type ProfileStatus = 'unreviewed' | 'updated' | 'reviewed';

export type ServerClassmate = {
  id: number,
  utln: string,
  email: string,
  isTerminated: boolean,
  capabilities: Capabilities,
  accountUpdates: AccountUpdateMeta[],
  profileStatus: ProfileStatus,
  hasProfile: boolean,
  activeScenes: {
    smash: boolean,
    social: boolean,
    stone: boolean
  },
  isAdmin: boolean,
  blockedRequestingAdmin: boolean
};
