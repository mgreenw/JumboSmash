// @flow
import type { Yak } from 'mobile/api/serverTypes';
import Get from './get';
import Vote from './vote';
import type { VoteYak_Action } from './vote';
import type { GetYaks_Action } from './get';

export type Yak_Action = GetYaks_Action | VoteYak_Action;

export type inProgress = {|
  get: boolean,
  vote: { [id: number]: boolean }
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
    vote: {}
  }
};

const Reducers = {
  Get,
  Vote
};

export { DefaultReduxState, Reducers };
