// @flow

import type { Dispatch, Match } from 'mobile/reducers';
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
  payload: Match[],
  meta: {}
};

function initiate(): GetMatchesInitiated_Action {
  return {
    type: 'GET_MATCHES__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(matches: Match[]): GetMatchesCompleted_Action {
  return {
    type: 'GET_MATCHES__COMPLETED',
    payload: matches,
    meta: {}
  };
}

// TODO: catch errors, e.g. the common network timeout.
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
