// @flow
import type { Yak } from 'mobile/api/serverTypes';
import Get from './get';
import Vote from './vote';
import Post from './post';
import type { VoteYak_Action } from './vote';
import type { GetYaks_Action } from './get';
import type { PostYak_Action } from './post';

export type Yak_Action = GetYaks_Action | VoteYak_Action | PostYak_Action;

export type inProgress = {|
  get: boolean,
  vote: { [id: number]: boolean },
  post: boolean
|};

export type ReduxState = {|
  inProgress: inProgress,
  byId: { [id: number]: Yak },
  currentYakIds: number[],
  clientYakIds: number[]
|};

const DefaultReduxState: ReduxState = {
  byId: {},
  currentYakIds: [],
  clientYakIds: [],
  inProgress: {
    get: false,
    vote: {},
    post: false
  }
};

const Reducers = {
  Get,
  Vote,
  Post
};

export { DefaultReduxState, Reducers };
