// @flow

import type { Dispatch } from 'mobile/reducers';
import type { Candidate, Scene } from 'mobile/reducers';
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

// TODO: catch errors, e.g. the common network timeout.
export default (scene: Scene) => (dispatch: Dispatch, getState: GetState) => {
  const { token } = getState();
  dispatch(initiate(scene));
  DevTesting.fakeLatency(() => {
    getSceneCandidates(token, scene)
      .then(candidates => {
        dispatch(complete(candidates, scene));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
