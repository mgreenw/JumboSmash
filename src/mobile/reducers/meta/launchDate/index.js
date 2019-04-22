// @flow
import type { LaunchDateStatus } from 'mobile/api/serverTypes';
import type { CheckLaunchDateAction } from './checkLaunchDate';
import CheckLaunchDate from './checkLaunchDate';

export type Action = CheckLaunchDateAction;

export type InProgress = {|
  checkLaunchDate: boolean
|};

export type ReduxState = {|
  inProgress: InProgress,
  status: null | LaunchDateStatus,
  response: {
    checkLaunchDateSuccess: null | boolean
  }
|};

const DefaultReduxState: ReduxState = {
  status: null,
  inProgress: {
    checkLaunchDate: false
  },
  response: {
    checkLaunchDateSuccess: null
  }
};

const Reducers = {
  CheckLaunchDate
};

export { DefaultReduxState, Reducers };
