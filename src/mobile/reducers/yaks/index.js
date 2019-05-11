// @flow
import type { Yak, YakVote } from 'mobile/api/serverTypes';
import Get from './get';
import type { GetYaks_Action } from './get';

export type Yak_Action = GetYaks_Action;

export type inProgress = {|
  get: boolean
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
    get: false
  }
};

const Reducers = {
  Get
};

export { DefaultReduxState, Reducers };
