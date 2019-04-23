// @flow

import type { Dispatch } from 'mobile/reducers';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import checkLaunchDateApi from 'mobile/api/meta/checkLaunchDate';
import type { LaunchDateStatus } from 'mobile/api/serverTypes';

export type CheckLaunchDateInitiated_Action = {
  type: 'CHECK_LAUNCH_DATE__INITIATED',
  payload: {},
  meta: {}
};
export type CheckLaunchDateCompleted_Action = {
  type: 'CHECK_LAUNCH_DATE__COMPLETED',
  payload: {
    status: LaunchDateStatus
  },
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

function complete(status: LaunchDateStatus): CheckLaunchDateCompleted_Action {
  return {
    type: 'CHECK_LAUNCH_DATE__COMPLETED',
    payload: {
      status
    },
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
  dispatch(initiate());
  checkLaunchDateApi()
    .then(launchDateStatus => {
      dispatch(complete(launchDateStatus));
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
