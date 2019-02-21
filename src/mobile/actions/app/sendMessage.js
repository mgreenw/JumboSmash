// @flow
import type { Dispatch, Message, GiftedChatMessage } from 'mobile/reducers';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';
import sendMessage from '../../api/messages/sendMessage';

export type SendMessageInitiated_Action = {
  type: 'SEND_MESSAGE__INITIATED',
  payload: {
    recieverUserId: number,
    giftedChatMessage: GiftedChatMessage
  },
  meta: {}
};
export type SendMessageCompleted_Action = {
  type: 'SEND_MESSAGE__COMPLETED',
  payload: {
    message: Message,
    recieverUserId: number,
    previousMessageId: number
  },
  meta: {}
};

function initiate(
  recieverUserId: number,
  giftedChatMessage: GiftedChatMessage
): SendMessageInitiated_Action {
  return {
    type: 'SEND_MESSAGE__INITIATED',
    payload: { recieverUserId, giftedChatMessage },
    meta: {}
  };
}

function complete(
  recieverUserId: number,
  message: Message,
  previousMessageId: number
): SendMessageCompleted_Action {
  return {
    type: 'SEND_MESSAGE__COMPLETED',
    payload: { recieverUserId, message, previousMessageId },
    meta: {}
  };
}

// TODO: catch errors, e.g. the common network timeout.
export default (
  recieverUserId: number,
  giftedChatMessage: GiftedChatMessage
) => (dispatch: Dispatch) => {
  dispatch(initiate(recieverUserId, giftedChatMessage));
  DevTesting.fakeLatency(() => {
    sendMessage(recieverUserId, giftedChatMessage.text, giftedChatMessage._id)
      .then(({ message, previousMessageId }) => {
        dispatch(complete(recieverUserId, message, previousMessageId));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
