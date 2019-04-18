// @flow

import type { Scene, Dispatch } from 'mobile/reducers';
import type { ServerCandidate } from 'mobile/api/serverTypes';
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
    candidates: ServerCandidate[],
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
  candidates: ServerCandidate[],
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

export default (scene: Scene, resetCandidates?: boolean) => (
  dispatch: Dispatch
) => {
  dispatch(initiate(scene));
  // Force the loading to show for a second.
  // This is a nice way to guarentee request ammounts.
  setTimeout(() => {
    getSceneCandidates(scene, resetCandidates)
      .then(candidates => {
        dispatch(complete(candidates, scene));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  }, 1500);
};
