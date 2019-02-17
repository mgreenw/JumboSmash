// @flow
import type { Scene, Dispatch } from 'mobile/reducers';
import judgeSceneCandidate from 'mobile/api/relationships/judgeSceneCandidate';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type JudgeSceneCandidateInitiated_Action = {
  type: 'JUDGE_SCENE_CANDIDATE__INITIATED',
  payload: { candidateUserId: number, scene: Scene },
  meta: {}
};
export type JudgeSceneCandidateCompleted_Action = {
  type: 'JUDGE_SCENE_CANDIDATE__COMPLETED',
  payload: { candidateUserId: number, scene: Scene },
  meta: {}
};

function initiate(
  candidateUserId: number,
  scene: Scene
): JudgeSceneCandidateInitiated_Action {
  return {
    type: 'JUDGE_SCENE_CANDIDATE__INITIATED',
    payload: { candidateUserId, scene },
    meta: {}
  };
}

function complete(
  candidateUserId: number,
  scene: Scene
): JudgeSceneCandidateCompleted_Action {
  return {
    type: 'JUDGE_SCENE_CANDIDATE__COMPLETED',
    payload: { candidateUserId, scene },
    meta: {}
  };
}

export default (candidateUserId: number, scene: Scene, liked: boolean) => (
  dispatch: Dispatch
) => {
  dispatch(initiate(candidateUserId, scene));
  judgeSceneCandidate(candidateUserId, scene, liked)
    .then(() => {
      dispatch(complete(candidateUserId, scene));
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
    });
};
