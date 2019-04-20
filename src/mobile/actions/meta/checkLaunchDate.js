// @flow

import type { Dispatch } from 'mobile/reducers';
import checkLaunchDate from 'mobile/api/meta/checkLaunchDate';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type CheckLaunchDateInitiated_Action = {
  type: 'CHECK_LAUNCH_DATE__INITIATED',
  payload: {},
  meta: {}
};
export type CheckLaunchDateCompleted_Action = {
  type: 'CHECK_LAUNCH_DATE__COMPLETED',
  payload: { launchDate: Date },
  meta: {}
};
export type CheckLaunchDateFailed_Action = {
  type: 'CHECK_LAUNCH_DATE__FAILED',
  payload: {},
  meta: {}
};

function initiate(): CheckLaunchDateInitiated_Action {
  return {
    type: 'CHECK_LAUNCH_DATE__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(launchDate: Date): CheckLaunchDateCompleted_Action {
  return {
    type: 'CHECK_LAUNCH_DATE__COMPLETED',
    payload: { launchDate },
    meta: {}
  };
}

function fail(): CheckLaunchDateFailed_Action {
  return {
    type: 'CHECK_LAUNCH_DATE__FAILED',
    payload: {},
    meta: {}
  };
}

export default () => (dispatch: Dispatch) => {
  // dispatch(initiate());
  // checkLaunchDate()
  //   .then(launchDate => {
  //     dispatch(complete(launchDate));
  //   })
  //   .catch(error => {
  //     dispatch(fail());
  //     dispatch(apiErrorHandler(error));
  //   });
};
