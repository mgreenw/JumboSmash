// @flow

import type { Candidate } from 'mobile/reducers';
import { apiRequest } from '../utils/apiRequest';
import { SCENE_CANDIDATES__ROUTES } from '../routes';

const GET_SCENE_CANDIDATES__SUCCESS = 'GET_SCENE_CANDIDATES__SUCCESS';

export default function getSceneCandidates(
  token: string,
  scene: string,
): Promise<Candidate[]> {
  return apiRequest('GET', SCENE_CANDIDATES__ROUTES[scene], token)
    .then((response) => {
      switch (response.status) {
        case GET_SCENE_CANDIDATES__SUCCESS: {
          return response.data;
        }
        default:
          throw new Error(response);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}
