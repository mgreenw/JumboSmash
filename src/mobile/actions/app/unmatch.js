// @flow
import type { Dispatch } from 'mobile/reducers';
import unmatch from 'mobile/api/relationships/unmatch';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type UnmatchInitiated_Action = {
  type: 'UNMATCH__INITIATED',
  payload: {},
  meta: {}
};
export type UnmatchCompleted_Action = {
  type: 'UNMATCH__COMPLETED',
  payload: { matchId: number },
  meta: {}
};

export type UnmatchFailed_Action = {
  type: 'UNMATCH__FAILED',
  payload: {},
  meta: {}
};

function initiate(): UnmatchInitiated_Action {
  return {
    type: 'UNMATCH__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(matchId: number): UnmatchCompleted_Action {
  return {
    type: 'UNMATCH__COMPLETED',
    payload: { matchId },
    meta: {}
  };
}

function fail(): UnmatchFailed_Action {
  return {
    type: 'UNMATCH__FAILED',
    payload: {},
    meta: {}
  };
}

export default (matchId: number) => (dispatch: Dispatch) => {
  dispatch(initiate());
  // We have to dislike the candidate in each scene
  unmatch(matchId)
    .then(() => {
      dispatch(complete(matchId));
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
