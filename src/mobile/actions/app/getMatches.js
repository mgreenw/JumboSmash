// @flow

import type { Dispatch } from 'mobile/reducers';
import type { ServerMatch } from 'mobile/api/serverTypes';
import getMatchesApi from 'mobile/api/relationships/getMatches';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type GetMatchesInitiated_Action = {
  type: 'GET_MATCHES__INITIATED',
  payload: {},
  meta: {}
};

export type GetMatchesCompleted_Action = {
  type: 'GET_MATCHES__COMPLETED',
  payload: ServerMatch[],
  meta: {}
};

export type GetMatchesFailed_Action = {
  type: 'GET_MATCHES__FAILED',
  payload: {},
  meta: {}
};

function initiate(): GetMatchesInitiated_Action {
  return {
    type: 'GET_MATCHES__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(matches: ServerMatch[]): GetMatchesCompleted_Action {
  return {
    type: 'GET_MATCHES__COMPLETED',
    payload: matches,
    meta: {}
  };
}

function fail(): GetMatchesFailed_Action {
  return {
    type: 'GET_MATCHES__FAILED',
    payload: {},
    meta: {}
  };
}
export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  getMatchesApi()
    .then(matches => {
      dispatch(complete(matches));
    })
    .catch(error => {
      fail();
      dispatch(apiErrorHandler(error));
    });
};
