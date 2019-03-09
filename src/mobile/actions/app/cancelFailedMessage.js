// @flow
import type { Dispatch } from 'mobile/reducers';

export type CancelFailedMessage_Action = {|
  type: 'CANCEL_FAILED_MESSAGE',
  payload: {|
    failedMessageUuid: string,
    receiverUserId: number
  |},
  meta: {}
|};

// No api call, so not really a thunk. We still use
// the same format though in case we want to add thunk-
// like behavoir (e.g. a timeout, or logging) for 
// consistancy. 
function genCancelFailedMessageAction(
  receiverUserId: number,
  failedMessageUuid: string
): CancelFailedMessage_Action {
  return {
    type: 'CANCEL_FAILED_MESSAGE',
    payload: { receiverUserId, failedMessageUuid },
    meta: {}
  };
}

export default (receiverUserId: number, failedMessageUuid: string) => (
  dispatch: Dispatch
) => {
  dispatch(genCancelFailedMessageAction(receiverUserId, failedMessageUuid));
};
