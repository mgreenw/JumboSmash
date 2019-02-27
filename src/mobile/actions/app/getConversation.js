// @flow

import type { Message, Dispatch } from 'mobile/reducers';
import getConversationApi from 'mobile/api/messages/getConversation';
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
  payload: { userId: number, messages: Message[] },
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
  messages: Message[]
): GetConversationCompleted_Action {
  return {
    type: 'GET_CONVERSATION__COMPLETED',
    payload: { userId, messages },
    meta: {}
  };
}

const getConversation = (userId: number, mostRecentMessageId?: number) => {
  function thunk(dispatch: Dispatch) {
    dispatch(initiate(userId));
    DevTesting.fakeLatency(() => {
      getConversationApi(userId, mostRecentMessageId)
        .then(messages => {
          dispatch(complete(userId, messages));
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  }
  thunk.interceptInOffline = true;
  return thunk;
};

export default getConversation;
