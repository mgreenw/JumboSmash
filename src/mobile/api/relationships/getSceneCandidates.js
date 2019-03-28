// @flow

import type { Scene } from 'mobile/reducers';
import store from 'mobile/store';
import { arrayToQueryString } from 'mobile/utils/Api';
import type { ServerCandidate } from '../serverTypes';
import apiRequest from '../utils/apiRequest';
import { SCENE_CANDIDATES__ROUTES } from '../routes';

const GET_SCENE_CANDIDATES__SUCCESS = 'GET_SCENE_CANDIDATES__SUCCESS';

export default function getSceneCandidates(
  scene: Scene,
  resetCandidates?: boolean
): Promise<ServerCandidate[]> {
  const { excludeSceneCandidateIds } = store.getState();
  const resetCandidatesQuery = resetCandidates ? '&reset-candidates' : '';
  const queryParams =
    arrayToQueryString('exclude[]', excludeSceneCandidateIds[scene]) +
    resetCandidatesQuery;
  const queryString = queryParams.length ? `?${queryParams}` : '';
  return apiRequest('GET', SCENE_CANDIDATES__ROUTES[scene] + queryString).then(
    response => {
      switch (response.status) {
        case GET_SCENE_CANDIDATES__SUCCESS: {
          return response.data;
        }
        default:
          throw new Error(response);
      }
    }
  );
}
