// @flow

import type { Candidate, Scene, Dispatch } from 'mobile/reducers';
import getSceneCandidates from 'mobile/api/relationships/getSceneCandidates';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

export type GetSceneCandidatesInitiated_Action = {
  type: 'GET_SCENE_CANDIDATES__INITIATED',
  payload: { scene: Scene },
  meta: {}
};
export type GetSceneCandidatesCompleted_Action = {
  type: 'GET_SCENE_CANDIDATES__COMPLETED',
  payload: {
    candidates: Candidate[],
    scene: Scene
  },
  meta: {}
};

function initiate(scene: Scene): GetSceneCandidatesInitiated_Action {
  return {
    type: 'GET_SCENE_CANDIDATES__INITIATED',
    payload: { scene },
    meta: {}
  };
}

function complete(
  candidates: Candidate[],
  scene: Scene
): GetSceneCandidatesCompleted_Action {
  return {
    type: 'GET_SCENE_CANDIDATES__COMPLETED',
    payload: {
      candidates,
      scene
    },
    meta: {}
  };
}

export default (scene: Scene) => (dispatch: Dispatch) => {
  dispatch(initiate(scene));
  DevTesting.fakeLatency(() => {
    getSceneCandidates(scene)
      .then(candidates => {
        dispatch(complete(candidates, scene));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
