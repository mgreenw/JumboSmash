// @flow

import type {
  GetClassmatesInitiated_Action,
  GetClassmatesCompleted_Action,
  GetClassmatesFailed_Action
} from 'mobile/actions/admin/getClassmates';
import type { ReduxState, InProgress } from '../index';

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
  const classmatesById = serverClassmates.reduce((curr, classmate) => {
    return {
      ...curr,
      [classmate.id]: classmate
    };
  }, {});

  return {
    ...state,
    classmatesById,
    classmateIds,
    inProgress
  };
}

function fail(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
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
