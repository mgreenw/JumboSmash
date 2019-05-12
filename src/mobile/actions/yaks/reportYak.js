// @flow
import type { Dispatch } from 'mobile/reducers';
import reportYak from 'mobile/api/yaks/reportYak';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type ReportYakInitiated_Action = {
  type: 'REPORT_YAK__INITIATED',
  payload: {},
  meta: {}
};
export type ReportYakCompleted_Action = {
  type: 'REPORT_YAK__COMPLETED',
  payload: {},
  meta: {}
};
export type ReportYakFailed_Action = {
  type: 'REPORT_YAK__FAILED',
  payload: {},
  meta: {}
};

function initiate(): ReportYakInitiated_Action {
  return {
    type: 'REPORT_YAK__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(): ReportYakCompleted_Action {
  return {
    type: 'REPORT_YAK__COMPLETED',
    payload: {},
    meta: {}
  };
}

function fail(): ReportYakFailed_Action {
  return {
    type: 'REPORT_YAK__FAILED',
    payload: {},
    meta: {}
  };
}

export default (
  yakId: number,
  reportMessage: string,
  reasonCodes: string[]
) => (dispatch: Dispatch) => {
  // reasonCodes can contain null values so we filter those out and join the codes with commas
  const reasonCode = reasonCodes.filter(r => r).join();
  dispatch(initiate());
  reportYak(yakId, reportMessage, reasonCode)
    .then(() => {
      dispatch(complete());
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
