// @flow

import type { Dispatch } from 'mobile/reducers';
import type { ServerMessage } from 'mobile/api/serverTypes';
import getConversation from 'mobile/api/conversations/getConversation';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
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
  payload: { userId: number, messages: ServerMessage[] },
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
  messages: ServerMessage[]
): GetConversationCompleted_Action {
  return {
    type: 'GET_CONVERSATION__COMPLETED',
    payload: { userId, messages },
    meta: {}
  };
}

export default (userId: number, mostRecentMessageId?: number) => (
  dispatch: Dispatch
) => {
  dispatch(initiate(userId));
  DevTesting.fakeLatency(() => {
    getConversation(userId, mostRecentMessageId)
      .then(({ messages }) => {
        dispatch(complete(userId, messages));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
