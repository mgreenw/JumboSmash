// @flow

import type { Match } from 'mobile/reducers/';
import { apiRequest } from '../utils/apiRequest';
import { GET_MATCHES__ROUTE } from '../routes';

const GET_MATCHES__SUCCESS = 'GET_MATCHES__SUCCESS';
function getMatches(token: string): Promise<Match[]> {
  return apiRequest('GET', GET_MATCHES__ROUTE, token)
    .then((response) => {
      switch (response.status) {
        case GET_MATCHES__SUCCESS:
          return response.data;
        default:
          throw { response };
      }
    })
    .catch((error) => {
      throw { error };
    });
}

export { getMatches };
