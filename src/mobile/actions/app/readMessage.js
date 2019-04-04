// @flow
import type { Dispatch } from 'mobile/reducers';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';
import readMessage from '../../api/conversations/readMessage';

export type ReadMessageInitiated_Action = {
  type: 'READ_MESSAGE__INITIATED',
  payload: {
    senderUserId: number,
    messageId: number
  },
  meta: {}
};
export type ReadMessageCompleted_Action = {
  type: 'READ_MESSAGE__COMPLETED',
  payload: {
    senderUserId: number,
    messageId: number
  },
  meta: {}
};
export type ReadMessageFailed_Action = {
  type: 'READ_MESSAGE__FAILED',
  payload: {
    senderUserId: number,
    messageId: number
  },
  meta: {}
};

function initiate(
  senderUserId: number,
  messageId: number
): ReadMessageInitiated_Action {
  return {
    type: 'READ_MESSAGE__INITIATED',
    payload: { senderUserId, messageId },
    meta: {}
  };
}

function complete(
  senderUserId: number,
  messageId: number
): ReadMessageCompleted_Action {
  return {
    type: 'READ_MESSAGE__COMPLETED',
    payload: { senderUserId, messageId },
    meta: {}
  };
}

function fail(
  senderUserId: number,
  messageId: number
): ReadMessageFailed_Action {
  return {
    type: 'READ_MESSAGE__FAILED',
    payload: { senderUserId, messageId },
    meta: {}
  };
}

export default (senderId: number, messageId: number) => (
  dispatch: Dispatch
) => {
  dispatch(initiate(senderId, messageId));
  DevTesting.fakeLatency(() => {
    readMessage(senderId, messageId)
      .then(() => {
        dispatch(complete(senderId, messageId));
      })
      .catch(error => {
        dispatch(fail(senderId, messageId));
        dispatch(apiErrorHandler(error));
      });
  });
};
