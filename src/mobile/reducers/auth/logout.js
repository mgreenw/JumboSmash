// @flow

import type {
  LogoutInitiated_Action,
  LogoutCompleted_Action,
  LogoutFailed_Action
} from 'mobile/actions/auth/logout';
import type { ReduxState, InProgress, ApiResponse } from '../index';

// NOTE: we disable eslint's no-unused-vars in this file on
//       functions where we may later want to use the action.

function updateInProgress(
  state: ReduxState,
  logoutInProgress: boolean
): InProgress {
  return {
    ...state.inProgress,
    logout: logoutInProgress
  };
}

function updateResponse(
  state: ReduxState,
  logoutSuccess: boolean
): ApiResponse {
  return {
    ...state.response,
    logoutSuccess
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: LogoutInitiated_Action
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
 * @param {LogoutCompleted_Action} action Not used currently
 */
function complete(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: LogoutCompleted_Action
): ReduxState {
  const inProgress = updateInProgress(state, false);
  const response = updateResponse(state, true);
  return {
    ...state,
    response,
    inProgress
  };
}

/* eslint-disable-next-line no-unused-vars */
function fail(state: ReduxState, action: LogoutFailed_Action): ReduxState {
  const inProgress = updateInProgress(state, false);
  const response = updateResponse(state, false);
  return {
    ...state,
    response,
    inProgress
  };
}

export type Logout_Action =
  | LogoutInitiated_Action
  | LogoutCompleted_Action
  | LogoutFailed_Action;

export default { initiate, complete, fail };
