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

function genAction(
  receiverUserId: number,
  failedMessageUuid: string
): CancelFailedMessage_Action {
  return {
    type: 'CANCEL_FAILED_MESSAGE',
    payload: { receiverUserId, failedMessageUuid },
    meta: {}
  };
}

// TODO: catch errors, e.g. the common network timeout.
export default (receiverUserId: number, failedMessageUuid: string) => (
  dispatch: Dispatch
) => {
  dispatch(genAction(receiverUserId, failedMessageUuid));
};
