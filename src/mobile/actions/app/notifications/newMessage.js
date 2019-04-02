// @flow
import type { Dispatch, Message, UserProfile } from 'mobile/reducers';

export type NewMessageInitiated_Action = {
  type: 'NEW_MESSAGE__INITIATED',
  payload: {},
  meta: {}
};

export type NewMessageCompleted_Action = {
  type: 'NEW_MESSAGE__COMPLETED',
  payload: {
    message: Message,
    senderProfile: UserProfile,
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
  message: Message,
  senderProfile: UserProfile,
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
  message: Message,
  senderProfile: UserProfile,
  senderUserId: number,
  previousMessageId: ?number
) => (dispatch: Dispatch) => {
  dispatch(initiate());
  dispatch(complete(message, senderProfile, senderUserId, previousMessageId));
};
