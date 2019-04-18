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
    postgradRegion: ?string
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
