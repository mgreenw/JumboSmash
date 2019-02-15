// @flow

import type { Dispatch } from 'mobile/reducers';
import type { Match } from 'mobile/reducers';
import { getMatches } from 'mobile/api/relationships/getMatches';
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
export default () => (dispatch: Dispatch, getState: GetState) => {
  const { token } = getState();
  dispatch(initiate());
  DevTesting.fakeLatency(() => {
    getMatches(token)
      .then(matches => {
        dispatch(complete(matches));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
