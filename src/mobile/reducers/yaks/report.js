// @flow

import type {
  ReportYakInitiated_Action,
  ReportYakCompleted_Action,
  ReportYakFailed_Action
} from 'mobile/actions/yaks/reportYak';
import type { ReduxState, inProgress } from './index';

function updateInProgress(
  state: ReduxState,
  isInProgress: boolean
): inProgress {
  return {
    ...state.inProgress,
    report: isInProgress
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: ReportYakInitiated_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, true)
  };
}

function complete(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: ReportYakCompleted_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, false)
  };
}

function fail(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: ReportYakFailed_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, false)
  };
}

export type ReportYak_Action =
  | ReportYakInitiated_Action
  | ReportYakCompleted_Action
  | ReportYakFailed_Action;

export default { initiate, complete, fail };
