// @flow
import type { Dispatch, Message } from 'mobile/reducers';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';
import sendMessage from '../../api/messages/sendMessage';

export type SendMessageInitiated_Action = {
  type: 'SEND_MESSAGE__INITIATED',
  payload: {
    recieverUserId: number,
    messageId: string
  },
  meta: {}
};
export type SendMessageCompleted_Action = {
  type: 'SEND_MESSAGE__COMPLETED',
  payload: { message: Message, recieverUserId: number, messageId: string },
  meta: {}
};

function initiate(
  recieverUserId: number,
  messageId: string
): SendMessageInitiated_Action {
  return {
    type: 'SEND_MESSAGE__INITIATED',
    payload: { recieverUserId, messageId },
    meta: {}
  };
}

function complete(
  recieverUserId: number,
  messageId: string,
  message: Message
): SendMessageCompleted_Action {
  return {
    type: 'SEND_MESSAGE__COMPLETED',
    payload: { recieverUserId, messageId, message },
    meta: {}
  };
}

// TODO: catch errors, e.g. the common network timeout.
export default (
  recieverUserId: number,
  messageId: string,
  messageContent: string
) => (dispatch: Dispatch) => {
  dispatch(initiate(recieverUserId, messageId));
  DevTesting.fakeLatency(() => {
    sendMessage(recieverUserId, messageContent)
      .then(message => {
        dispatch(complete(recieverUserId, messageId, message));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
