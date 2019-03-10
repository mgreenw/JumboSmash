// @flow
import type { Dispatch } from 'mobile/reducers';
import { Scenes } from 'mobile/reducers';
import judgeSceneCandidate from 'mobile/api/relationships/judgeSceneCandidate';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type UnmatchInitiated_Action = {
  type: 'UNMATCH__INITIATED',
  payload: { candidateUserId: number },
  meta: {}
};
export type UnmatchCompleted_Action = {
  type: 'UNMATCH__COMPLETED',
  payload: { candidateUserId: number },
  meta: {}
};

function initiate(candidateUserId: number): UnmatchInitiated_Action {
  return {
    type: 'UNMATCH__INITIATED',
    payload: { candidateUserId },
    meta: {}
  };
}

function complete(candidateUserId: number): UnmatchCompleted_Action {
  return {
    type: 'UNMATCH__COMPLETED',
    payload: { candidateUserId },
    meta: {}
  };
}

export default (candidateUserId: number) => (dispatch: Dispatch) => {
  dispatch(initiate(candidateUserId));
  // We have to dislike the candidate in each scene
  Promise.all(
    Scenes.map(scene => judgeSceneCandidate(candidateUserId, scene, false))
  )
    .then(() => {
      dispatch(complete(candidateUserId));
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
    });
};
