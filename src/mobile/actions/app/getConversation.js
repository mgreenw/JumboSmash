// @flow

import type { Dispatch } from 'mobile/reducers';
import type { ServerMessage } from 'mobile/api/serverTypes';
import getConversation from 'mobile/api/conversations/getConversation';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import store from 'mobile/store';
import DevTesting from '../../utils/DevTesting';

export type GetConversationInitiated_Action = {
  type: 'GET_CONVERSATION__INITIATED',
  payload: {
    userId: number
  },
  meta: {}
};
export type GetConversationCompleted_Action = {
  type: 'GET_CONVERSATION__COMPLETED',
  payload: {
    userId: number,
    messages: ServerMessage[],
    previousMessageId: ?number
  },
  meta: {}
};

function initiate(userId: number): GetConversationInitiated_Action {
  return {
    type: 'GET_CONVERSATION__INITIATED',
    payload: { userId },
    meta: {}
  };
}

function complete(
  userId: number,
  messages: ServerMessage[],
  previousMessageId: ?number
): GetConversationCompleted_Action {
  return {
    type: 'GET_CONVERSATION__COMPLETED',
    payload: { userId, messages, previousMessageId },
    meta: {}
  };
}

// TODO: enforce 1 per conversation invariant at a time
export default (userId: number) => (dispatch: Dispatch) => {
  dispatch(initiate(userId));
  const { confirmedConversations } = store.getState();
  const confirmedMessages = confirmedConversations[userId];
  const [mostRecentMessageId] = confirmedMessages
    ? confirmedMessages.inOrderIds.slice(-1)
    : [undefined];
  DevTesting.fakeLatency(() => {
    getConversation(userId, mostRecentMessageId)
      .then(messages => {
        dispatch(complete(userId, messages, mostRecentMessageId));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
