// @flow
import type { Dispatch } from 'mobile/reducers';
import reportUser from 'mobile/api/relationships/reportUser';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type ReportUserInitiated_Action = {
  type: 'REPORT_USER__INITIATED',
  payload: {},
  meta: {}
};
export type ReportUserCompleted_Action = {
  type: 'REPORT_USER__COMPLETED',
  payload: {},
  meta: {}
};
export type ReportUserFailed_Action = {
  type: 'REPORT_USER__FAILED',
  payload: {},
  meta: {}
};

function initiate(): ReportUserInitiated_Action {
  return {
    type: 'REPORT_USER__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(): ReportUserCompleted_Action {
  return {
    type: 'REPORT_USER__COMPLETED',
    payload: {},
    meta: {}
  };
}

function fail(): ReportUserFailed_Action {
  return {
    type: 'REPORT_USER__FAILED',
    payload: {},
    meta: {}
  };
}

export default (
  userId: number,
  reportMessage: string,
  reasonCodes: string[]
) => (dispatch: Dispatch) => {
  // reasonCodes can contain null values so we filter those out and join the codes with commas
  const reasonCode = reasonCodes.filter(r => r).join();
  dispatch(initiate());
  reportUser(userId, reportMessage, reasonCode, false)
    .then(() => {
      dispatch(complete());
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
