// @flow
import type { Dispatch } from 'mobile/reducers';
import { Scenes } from 'mobile/reducers';
import judgeSceneCandidate from 'mobile/api/relationships/judgeSceneCandidate';
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
  Promise.all(Scenes.map(scene => judgeSceneCandidate(matchId, scene, false)))
    .then(() => {
      dispatch(complete(matchId));
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
