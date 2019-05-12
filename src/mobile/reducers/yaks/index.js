// @flow
import type { Yak } from 'mobile/api/serverTypes';
import Get from './get';
import Vote from './vote';
import Post from './post';
import Report from './report';
import type { VoteYak_Action } from './vote';
import type { GetYaks_Action } from './get';
import type { PostYak_Action } from './post';
import type { ReportYak_Action } from './report';

export type Yak_Action =
  | GetYaks_Action
  | VoteYak_Action
  | PostYak_Action
  | ReportYak_Action;

export type inProgress = {|
  get: boolean,
  vote: { [id: number]: boolean },
  post: boolean,
  report: boolean // invariant: only one at a time.
|};

export type ReduxState = {|
  inProgress: inProgress,
  byId: { [id: number]: Yak },
  currentYakIds: number[],
  clientYakIds: number[],
  nextPostTimestamp: null | string
|};

const DefaultReduxState: ReduxState = {
  byId: {},
  currentYakIds: [],
  clientYakIds: [],
  inProgress: {
    get: false,
    vote: {},
    post: false,
    report: false
  },
  nextPostTimestamp: null
};

const Reducers = {
  Get,
  Vote,
  Post,
  Report
};

export { DefaultReduxState, Reducers };
