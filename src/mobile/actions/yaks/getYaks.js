// @flow
import type { Dispatch } from 'mobile/reducers';
import type { Yak } from 'mobile/api/serverTypes';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import getYaks from 'mobile/api/yaks/getYaks';

export type GetYaksInitiated_Action = {
  type: 'GET_YAKS__INITIATED',
  payload: {},
  meta: {}
};
export type GetYaksCompleted_Action = {
  type: 'GET_YAKS__COMPLETED',
  payload: { yaks: Yak[] },
  meta: {}
};
export type GetYaksFailed_Action = {
  type: 'GET_YAKS__FAILED',
  payload: {},
  meta: {}
};

function initiate(): GetYaksInitiated_Action {
  return {
    type: 'GET_YAKS__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(yaks: Yak[]): GetYaksCompleted_Action {
  return {
    type: 'GET_YAKS__COMPLETED',
    payload: { yaks },
    meta: {}
  };
}

function fail(): GetYaksFailed_Action {
  return {
    type: 'GET_YAKS__FAILED',
    payload: {},
    meta: {}
  };
}

export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  getYaks()
    .then(({ yaks }) => {
      dispatch(complete(yaks));
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
