// @flow

import type {
  SendVerificationEmailInitiated_Action,
  SendVerificationEmailCompleted_Action,
  SendVerificationEmailFailed_Action,
  SendVerificationEmail_Response
} from 'mobile/actions/auth/sendVerificationEmail';
import type { ReduxState, InProgress, ApiResponse } from '../index';

function updateInProgress(
  state: ReduxState,
  isInProgress: boolean
): InProgress {
  return {
    ...state.inProgress,
    sendVerificationEmail: isInProgress
  };
}

function updateResponse(
  state: ReduxState,
  response: ?SendVerificationEmail_Response
): ApiResponse {
  return {
    ...state.response,
    sendVerificationEmail: response
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: SendVerificationEmailInitiated_Action
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
 * @param {SendVerificationEmailCompleted_Action} action Not used currently
 */
function complete(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: SendVerificationEmailCompleted_Action
): ReduxState {
  const inProgress = updateInProgress(state, false);
  const response = updateResponse(state, action.payload.response);
  return {
    ...state,
    response,
    inProgress
  };
}

function fail(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: SendVerificationEmailFailed_Action
): ReduxState {
  const inProgress = updateInProgress(state, false);
  const response = updateResponse(state, null);
  return {
    ...state,
    response,
    inProgress
  };
}

export type SendVerificationEmail_Action =
  | SendVerificationEmailInitiated_Action
  | SendVerificationEmailCompleted_Action
  | SendVerificationEmailFailed_Action;

export default { initiate, complete, fail };
