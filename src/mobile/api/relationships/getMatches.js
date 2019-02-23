// @flow

import type { Match } from 'mobile/reducers/';
import apiRequest from '../utils/apiRequest';
import { GET_MATCHES__ROUTE } from '../routes';

const GET_MATCHES__SUCCESS = 'GET_MATCHES__SUCCESS';
export default function getMatches(): Promise<Match[]> {
  return apiRequest('GET', GET_MATCHES__ROUTE)
    .then(response => {
      switch (response.status) {
        case GET_MATCHES__SUCCESS:
          return response.data;
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error };
    });
}
