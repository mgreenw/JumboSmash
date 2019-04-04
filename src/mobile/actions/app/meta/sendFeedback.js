// @flow
import type { Dispatch } from 'mobile/reducers';
import sendFeedback from 'mobile/api/meta/sendFeedback';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type SendFeedbackInitiated_Action = {
  type: 'SEND_FEEDBACK__INITIATED',
  payload: {},
  meta: {}
};
export type SendFeedbackCompleted_Action = {
  type: 'SEND_FEEDBACK__COMPLETED',
  payload: {},
  meta: {}
};
export type SendFeedbackFailed_Action = {
  type: 'SEND_FEEDBACK__FAILED',
  payload: {},
  meta: {}
};

function initiate(): SendFeedbackInitiated_Action {
  return {
    type: 'SEND_FEEDBACK__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(): SendFeedbackCompleted_Action {
  return {
    type: 'SEND_FEEDBACK__COMPLETED',
    payload: {},
    meta: {}
  };
}

function fail(): SendFeedbackFailed_Action {
  return {
    type: 'SEND_FEEDBACK__FAILED',
    payload: {},
    meta: {}
  };
}

export default (message: string) => (dispatch: Dispatch) => {
  dispatch(initiate());
  sendFeedback(message)
    .then(() => {
      dispatch(complete());
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
