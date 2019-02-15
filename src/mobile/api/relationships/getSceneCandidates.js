// @flow

import type { Candidate, Scene } from 'mobile/reducers';
import apiRequest from '../utils/apiRequest';
import { SCENE_CANDIDATES__ROUTES } from '../routes';

const GET_SCENE_CANDIDATES__SUCCESS = 'GET_SCENE_CANDIDATES__SUCCESS';

export default function getSceneCandidates(scene: Scene): Promise<Candidate[]> {
  return apiRequest('GET', SCENE_CANDIDATES__ROUTES[scene])
    .then(response => {
      switch (response.status) {
        case GET_SCENE_CANDIDATES__SUCCESS: {
          return response.data;
        }
        default:
          throw new Error(response);
      }
    })
    .catch(error => {
      throw new Error(error);
    });
}
