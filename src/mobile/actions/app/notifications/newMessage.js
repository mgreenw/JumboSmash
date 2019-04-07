// @flow
import type { Dispatch } from 'mobile/reducers';
import type { ServerProfile, ServerMessage } from 'mobile/api/serverTypes';

export type NewMessageInitiated_Action = {
  type: 'NEW_MESSAGE__INITIATED',
  payload: {},
  meta: {}
};

export type NewMessageCompleted_Action = {
  type: 'NEW_MESSAGE__COMPLETED',
  payload: {
    message: ServerMessage,
    senderProfile: ServerProfile,
    senderUserId: number,
    previousMessageId: ?number
  },
  meta: {}
};

function initiate(): NewMessageInitiated_Action {
  return {
    type: 'NEW_MESSAGE__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(
  message: ServerMessage,
  senderProfile: ServerProfile,
  senderUserId: number,
  previousMessageId: ?number
): NewMessageCompleted_Action {
  return {
    type: 'NEW_MESSAGE__COMPLETED',
    payload: { message, senderProfile, senderUserId, previousMessageId },
    meta: {}
  };
}

export default (
  message: ServerMessage,
  senderProfile: ServerProfile,
  senderUserId: number,
  previousMessageId: ?number
) => (dispatch: Dispatch) => {
  dispatch(initiate());
  dispatch(complete(message, senderProfile, senderUserId, previousMessageId));
};
