// @flow

import type {
  GetClassmatesInitiated_Action,
  GetClassmatesCompleted_Action,
  GetClassmatesFailed_Action
} from 'mobile/actions/app/getClassmates';
import type { ReduxState, InProgress, ApiResponse } from '../index';

// NOTE: we disable eslint's no-unused-vars in this file on
//       functions where we may later want to use the action.

function updateInProgress(
  state: ReduxState,
  getClassmatesInProgress: boolean
): InProgress {
  return {
    ...state.inProgress,
    getClassmates: getClassmatesInProgress
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: GetClassmatesInitiated_Action
): ReduxState {
  const inProgress = updateInProgress(state, true);
  return {
    ...state,
    inProgress
  };
}

/**
 * Changes the app's state to the default state.
 * @param {ReduxState} state Not used currently
 * @param {GetClassmatesCompleted_Action} action Not used currently
 */
function complete(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: GetClassmatesCompleted_Action
): ReduxState {
  const inProgress = updateInProgress(state, false);

  const { payload: serverClassmates } = action;
  const classmateIds = serverClassmates.map(classmate => classmate.id);
  const classmates = serverClassmates.reduce((curr, classmate) => {
    return {
      ...curr,
      [classmate.id]: classmate
    };
  }, {});

  return {
    ...state,
    classmates,
    classmateIds,
    inProgress
  };
}

/* eslint-disable-next-line no-unused-vars */
function fail(
  state: ReduxState,
  action: GetClassmatesFailed_Action
): ReduxState {
  const inProgress = updateInProgress(state, false);
  return {
    ...state,
    inProgress
  };
}

export type GetClassmates_Action =
  | GetClassmatesInitiated_Action
  | GetClassmatesCompleted_Action
  | GetClassmatesFailed_Action;

export default { initiate, complete, fail };
