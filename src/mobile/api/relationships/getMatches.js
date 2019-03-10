// @flow

import type { ServerMatch } from '../serverTypes';
import apiRequest from '../utils/apiRequest';
import { GET_MATCHES__ROUTE } from '../routes';

const GET_MATCHES__SUCCESS = 'GET_MATCHES__SUCCESS';
export default function getMatches(): Promise<ServerMatch[]> {
  return apiRequest('GET', GET_MATCHES__ROUTE).then(response => {
    switch (response.status) {
      case GET_MATCHES__SUCCESS:
        return response.data;
      default:
        throw new Error(response);
    }
  });
}
