// @flow

// Internally, we want to represent a lot of nested data pretty differently, using normalizer.
// Here we keep track of how the server represents the data we pass back so our parsers operate
// in a well typed way.

export type ServerProfile = {
  fields: {
    displayName: string,
    bio: string,
    birthday: string
  },
  photoUuids: number[]
};

export type ServerBaseUser = {
  userId: number,
  profile: ServerProfile
};

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

export type ServerMatch = ServerBaseUser & {
  scenes: ServerScenes,
  mostRecentMessage: ServerMessage
};
