// @flow

import type {
  SendMessageInitiated_Action,
  SendMessageCompleted_Action,
  SendMessageFailed_Action
} from 'mobile/actions/app/sendMessage';
import { updateConfirmedConversation, updateMostRecentMessage } from '../index';
import type { ReduxState, InProgress } from '../index';

function updateInProgress(
  state: ReduxState,
  receiverUserId: number,
  messageUuid: string,
  isInProgress: boolean
): InProgress {
  return {
    ...state.inProgress,
    sendMessage: {
      ...state.inProgress.sendMessage,
      [receiverUserId]: {
        ...state.inProgress.sendMessage[receiverUserId],
        [messageUuid]: isInProgress
      }
    }
  };
}

function initiate(
  state: ReduxState,
  action: SendMessageInitiated_Action
): ReduxState {
  const { receiverUserId, giftedChatMessage } = action.payload;

  // Initialize to an empty object in case this is the first time sending a message
  // for a fresh store so that we can destructure with defaults.
  const unsentMessages = state.unconfirmedConversations[receiverUserId] || {};
  const {
    byId = {},
    allIds = [],
    inProgressIds = [],
    failedIds = []
  } = unsentMessages;
  const uuid = giftedChatMessage._id;

  // If we are resending a message, we want to move the Id to inProgress.
  const newFailedIds = failedIds.filter(i => i !== uuid);

  const inProgress = updateInProgress(state, receiverUserId, uuid, true);

  return {
    ...state,
    inProgress,
    unconfirmedConversations: {
      ...state.unconfirmedConversations,
      [receiverUserId]: {
        byId: {
          ...byId,
          [uuid]: giftedChatMessage
        },
        allIds: [...allIds, uuid],
        inProgressIds: [...inProgressIds, uuid],
        failedIds: newFailedIds
      }
    }
  };
}

function complete(
  state: ReduxState,
  action: SendMessageCompleted_Action
): ReduxState {
  const { receiverUserId, previousMessageId, message } = action.payload;
  const { messageId: id, unconfirmedMessageUuid: uuid } = message;

  // remove the sent message from the unsent list
  const { inProgressIds = [], allIds = [] } = state.unconfirmedConversations[
    receiverUserId
  ];
  const newInProgressIds = inProgressIds.filter(i => i !== uuid);
  const newAllIds = allIds.filter(i => i !== uuid);

  const confirmedConversations = updateConfirmedConversation(
    state,
    receiverUserId,
    { [id]: message },
    [id],
    previousMessageId
  );

  const {
    unmessagedMatchIds,
    messagedMatchIds,
    matchesById
  } = updateMostRecentMessage(state, receiverUserId, id);

  // NOTE: state.inProgress.sendMessage[receiverUserId] CAN be undefined,
  // but because it is accessed within an object, the spread operator
  // will return an empty array if so.
  return {
    ...state,
    inProgress: {
      ...state.inProgress,
      sendMessage: {
        ...state.inProgress.sendMessage,
        [receiverUserId]: {
          ...state.inProgress.sendMessage[receiverUserId],
          [uuid]: false
        }
      }
    },
    confirmedConversations,
    // Must have values because initialized on Send Message Initiate
    // TODO: consider deleting the message from unconfirmed byIds. (For invarients?)
    unconfirmedConversations: {
      ...state.unconfirmedConversations,
      [receiverUserId]: {
        ...state.unconfirmedConversations[receiverUserId],
        allIds: newAllIds,
        inProgressIds: newInProgressIds
      }
    },
    unmessagedMatchIds,
    messagedMatchIds,
    matchesById
  };
}

/**
 *
 * @param {ReduxState} state
 * @param {SendMessageFailed_Action} action
 * Remove Id from in progress messages, add to failed messages.
 */
function fail(state: ReduxState, action: SendMessageFailed_Action): ReduxState {
  const { receiverUserId, messageUuid: uuid } = action.payload;

  const unsentMessages = state.unconfirmedConversations[receiverUserId] || {};
  const { inProgressIds = [], failedIds = [] } = unsentMessages;

  const newInProgressIds = inProgressIds.filter(i => i !== uuid);
  const newFailedIds = [...failedIds, uuid];

  const inProgress = updateInProgress(state, receiverUserId, uuid, false);

  return {
    ...state,
    inProgress,
    unconfirmedConversations: {
      ...state.unconfirmedConversations,
      [receiverUserId]: {
        ...unsentMessages,
        inProgressIds: newInProgressIds,
        failedIds: newFailedIds
      }
    }
  };
}

export type SendMessage_Action =
  | SendMessageInitiated_Action
  | SendMessageCompleted_Action
  | SendMessageFailed_Action;

export default { initiate, complete, fail };
