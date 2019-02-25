// @flow

import type { Dispatch } from 'mobile/reducers';
import type { ServerMatch } from 'mobile/api/serverTypes';
import getMatchesApi from 'mobile/api/relationships/getMatches';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

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

export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  DevTesting.fakeLatency(() => {
    getMatchesApi()
      .then(matches => {
        dispatch(complete(matches));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
