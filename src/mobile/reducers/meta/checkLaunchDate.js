// @flow

import type {
  CheckLaunchDateInitiated_Action,
  CheckLaunchDateCompleted_Action,
  CheckLaunchDateFailed_Action
} from 'mobile/actions/meta/checkLaunchDate';
import type { ReduxState, InProgress } from '../index';

function updateInProgress(
  state: ReduxState,
  isInProgress: boolean
): InProgress {
  return {
    ...state.inProgress,
    checkLaunchDate: isInProgress
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: CheckLaunchDateInitiated_Action
): ReduxState {
  const inProgress = updateInProgress(state, true);
  return {
    ...state,
    inProgress
  };
}

function complete(
  state: ReduxState,
  action: CheckLaunchDateCompleted_Action
): ReduxState {
  const { launchDate } = action.payload;
  const inProgress = updateInProgress(state, false);

  return {
    ...state,
    inProgress,
    launchDate
  };
}

function fail(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: CheckLaunchDateFailed_Action
): ReduxState {
  const inProgress = updateInProgress(state, false);
  return {
    ...state,
    inProgress
  };
}

export type CheckLaunchDate_Action =
  | CheckLaunchDateInitiated_Action
  | CheckLaunchDateCompleted_Action
  | CheckLaunchDateFailed_Action;

export default { initiate, complete, fail };
