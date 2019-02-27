// @flow

import type { Candidate, Scene, Dispatch } from 'mobile/reducers';
import getSceneCandidatesApi from 'mobile/api/relationships/getSceneCandidates';
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

const getSceneCandidates = (scene: Scene) => {
  function thunk(dispatch: Dispatch) {
    dispatch(initiate(scene));
    DevTesting.fakeLatency(() => {
      getSceneCandidatesApi(scene)
        .then(candidates => {
          dispatch(complete(candidates, scene));
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  }
  thunk.interceptInOffline = true;
  return thunk;
};

export default getSceneCandidates;
