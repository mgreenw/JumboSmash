// @flow

import type {
  ReadMessageInitiated_Action,
  ReadMessageCompleted_Action,
  ReadMessageFailed_Action
} from 'mobile/actions/app/readMessage';
import type { ReduxState, ReadMessages, InProgress } from '../index';

function updateReadMessages(
  state: ReduxState,
  senderUserId: number,
  messageId: ?number
): ReadMessages {
  return {
    ...state.readMessages,
    [senderUserId]: messageId
  };
}

function updateInProgress(
  state: ReduxState,
  senderUserId: number,
  messageId: ?number,
  isInProgress: boolean
): InProgress {
  return {
    ...state.inProgress,
    readMessage: {
      ...state.inProgress.readMessage,
      [senderUserId]: {
        ...state.inProgress.readMessage[senderUserId],
        [messageId]: isInProgress
      }
    }
  };
}

function initiate(
  state: ReduxState,
  action: ReadMessageInitiated_Action
): ReduxState {
  const { senderUserId, messageId } = action.payload;
  const inProgress = updateInProgress(state, senderUserId, messageId, true);
  return {
    ...state,
    inProgress
  };
}

function complete(
  state: ReduxState,
  action: ReadMessageCompleted_Action
): ReduxState {
  const { senderUserId, messageId } = action.payload;
  const readMessages = updateReadMessages(state, senderUserId, messageId);
  const inProgress = updateInProgress(state, senderUserId, messageId, false);
  return {
    ...state,
    inProgress,
    readMessages
  };
}

/**
 *
 * @param {ReduxState} state
 * @param {ReadMessageInitiated_Action} action
 * This is a fire and forget function, so if it fails we just update `inProgress`.
 * By NOT changing readMessages, this message can still trigger a new readMessage call.
 */
function fail(state: ReduxState, action: ReadMessageFailed_Action): ReduxState {
  const { senderUserId, messageId } = action.payload;
  const inProgress = updateInProgress(state, senderUserId, messageId, false);
  return {
    ...state,
    inProgress
  };
}

export type ReadMessage_Action =
  | ReadMessageInitiated_Action
  | ReadMessageCompleted_Action
  | ReadMessageFailed_Action;

export default { initiate, complete, fail };
