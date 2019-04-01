// @flow
import type { Dispatch, Message, GiftedChatMessage } from 'mobile/reducers';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';
import sendMessage from '../../api/conversations/sendMessage';

export type SendMessageInitiated_Action = {
  type: 'SEND_MESSAGE__INITIATED',
  payload: {
    receiverUserId: number,
    giftedChatMessage: GiftedChatMessage
  },
  meta: {}
};
export type SendMessageCompleted_Action = {
  type: 'SEND_MESSAGE__COMPLETED',
  payload: {
    message: Message,
    receiverUserId: number,
    previousMessageId: number
  },
  meta: {}
};
export type SendMessageFailed_Action = {
  type: 'SEND_MESSAGE__FAILED',
  payload: {
    receiverUserId: number,
    messageUuid: string
  },
  meta: {}
};

function initiate(
  receiverUserId: number,
  giftedChatMessage: GiftedChatMessage
): SendMessageInitiated_Action {
  return {
    type: 'SEND_MESSAGE__INITIATED',
    payload: { receiverUserId, giftedChatMessage },
    meta: {}
  };
}

function complete(
  receiverUserId: number,
  message: Message,
  previousMessageId: number
): SendMessageCompleted_Action {
  return {
    type: 'SEND_MESSAGE__COMPLETED',
    payload: { receiverUserId, message, previousMessageId },
    meta: {}
  };
}

function fail(
  receiverUserId: number,
  messageUuid: string
): SendMessageFailed_Action {
  return {
    type: 'SEND_MESSAGE__FAILED',
    payload: { receiverUserId, messageUuid },
    meta: {}
  };
}

// TODO: catch errors, e.g. the common network timeout.
export default (
  receiverUserId: number,
  giftedChatMessage: GiftedChatMessage
) => (dispatch: Dispatch) => {
  dispatch(initiate(receiverUserId, giftedChatMessage));
  DevTesting.fakeLatency(() => {
    sendMessage(receiverUserId, giftedChatMessage.text, giftedChatMessage._id)
      .then(({ message, previousMessageId }) => {
        dispatch(complete(receiverUserId, message, previousMessageId));
      })
      .catch(error => {
        dispatch(fail(receiverUserId, giftedChatMessage._id));
        dispatch(apiErrorHandler(error));
      });
  });
};
