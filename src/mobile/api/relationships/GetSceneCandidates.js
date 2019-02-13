// @flow
/* eslint-disable */

import type { Candidate } from 'mobile/reducers';
import { apiRequest } from '../utils/apiRequest';
import { SMASH_CANDIDATES__ROUTE } from '../routes';

const GET_SCENE_CANDIDATES__SUCCESS = 'GET_SCENE_CANDIDATES__SUCCESS';

type request = {
  token: string,
};

export default function getSceneCandidates(
  request: request
): Promise<?(Candidate[])> {
  return apiRequest('GET', SMASH_CANDIDATES__ROUTE, request.token)
    .then(response => {
      switch (response.status) {
        case GET_SCENE_CANDIDATES__SUCCESS:
          return response.data;
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}
