// @flow
import type { Dispatch } from 'mobile/reducers';
import reportUser from 'mobile/api/relationships/reportUser';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type BlockUserInitiated_Action = {
  type: 'BLOCK_USER__INITIATED',
  payload: {},
  meta: {}
};
export type BlockUserCompleted_Action = {
  type: 'BLOCK_USER__COMPLETED',
  payload: { userId: number },
  meta: {}
};
export type BlockUserFailed_Action = {
  type: 'BLOCK_USER__FAILED',
  payload: {},
  meta: {}
};

function initiate(): BlockUserInitiated_Action {
  return {
    type: 'BLOCK_USER__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(userId: number): BlockUserCompleted_Action {
  return {
    type: 'BLOCK_USER__COMPLETED',
    payload: { userId },
    meta: {}
  };
}

function fail(): BlockUserFailed_Action {
  return {
    type: 'BLOCK_USER__FAILED',
    payload: {},
    meta: {}
  };
}

export default (
  userId: number,
  reportMessage: string,
  reasonCodes: string[]
) => (dispatch: Dispatch) => {
  const reasonCode = reasonCodes.filter(r => r).join();
  dispatch(initiate());
  reportUser(userId, reportMessage, reasonCode, true)
    .then(() => {
      dispatch(complete(userId));
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
