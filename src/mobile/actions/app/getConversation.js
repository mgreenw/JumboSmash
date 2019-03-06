// @flow

import type { Message, Dispatch } from 'mobile/reducers';
import getConversation from 'mobile/api/messages/getConversation';
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
  payload: {
    userId: number,
    messages: Message[],
    messageReadTimestamp: ?string
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
  messages: Message[],
  messageReadTimestamp: ?string
): GetConversationCompleted_Action {
  return {
    type: 'GET_CONVERSATION__COMPLETED',
    payload: { userId, messages, messageReadTimestamp },
    meta: {}
  };
}

export default (userId: number, mostRecentMessageId?: number) => (
  dispatch: Dispatch
) => {
  dispatch(initiate(userId));
  DevTesting.fakeLatency(() => {
    getConversation(userId, mostRecentMessageId)
      .then(({ messages, messageReadTimestamp }) => {
        dispatch(complete(userId, messages, messageReadTimestamp));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
