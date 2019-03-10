// @flow

import type { Candidate, Scene } from 'mobile/reducers';
import apiRequest from '../utils/apiRequest';
import { JUDGE_SCENE_CANDIDATE__ROUTE } from '../routes';

const JUDGE__SUCCESS = 'JUDGE__SUCCESS';

export default function judgeSceneCandidate(
  candidateUserId: number,
  scene: Scene,
  liked: boolean
): Promise<Candidate[]> {
  return apiRequest('POST', JUDGE_SCENE_CANDIDATE__ROUTE, {
    candidateUserId,
    scene,
    liked
  })
    .then(response => {
      switch (response.status) {
        case JUDGE__SUCCESS: {
          return response.data;
        }
        default:
          console.log(response);
          throw new Error(response);
      }
    })
    .catch(error => {
      throw new Error(error);
    });
}
