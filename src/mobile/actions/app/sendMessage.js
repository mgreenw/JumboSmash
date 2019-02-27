// @flow
import type { Dispatch, Message, GiftedChatMessage } from 'mobile/reducers';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';
import sendMessageApi from '../../api/messages/sendMessage';

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

const saveMessage = (
  receiverUserId: number,
  giftedChatMessage: GiftedChatMessage
) => {
  function thunk(dispatch: Dispatch) {
    dispatch(initiate(receiverUserId, giftedChatMessage));
    DevTesting.fakeLatency(() => {
      sendMessageApi(
        receiverUserId,
        giftedChatMessage.text,
        giftedChatMessage._id
      )
        .then(({ message, previousMessageId }) => {
          dispatch(complete(receiverUserId, message, previousMessageId));
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  }
  thunk.interceptInOffline = true;
  return thunk;
};

export default saveMessage;
