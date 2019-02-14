// @flow
/* eslint-disable */

import type { Dispatch, GetState } from 'redux';
import type { Candidate } from 'mobile/reducers';
import getSceneCandidates from 'mobile/api/relationships/getSceneCandidates';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

export type GetSceneCandidatesInitiated_Action = {
  type: 'GET_SCENE_CANDIDATES__INITIATED',
  payload: { scene: string },
  meta: {},
};
export type GetSceneCandidatesCompleted_Action = {
  type: 'GET_SCENE_CANDIDATES__COMPLETED',
  payload: {
    candidates: Candidate[],
    scene: string,
  },
  meta: {},
};

function initiate(scene: string): GetSceneCandidatesInitiated_Action {
  return {
    type: 'GET_SCENE_CANDIDATES__INITIATED',
    payload: { scene },
    meta: {},
  };
}

function complete(
  candidates: Candidate[],
  scene: string
): GetSceneCandidatesCompleted_Action {
  return {
    type: 'GET_SCENE_CANDIDATES__COMPLETED',
    payload: {
      candidates,
      scene,
    },
    meta: {},
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function getSceneCandidatesAction(scene: string) {
  return function(dispatch: Dispatch, getState: GetState) {
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
}
