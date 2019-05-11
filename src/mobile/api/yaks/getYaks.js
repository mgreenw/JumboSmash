// @flow
import type { Yak } from 'mobile/api/serverTypes';
import apiRequest from '../utils/apiRequest';
import { GET_YAKS__ROUTE } from '../routes';

const GET_YAKS__SUCCESS = 'GET_YAKS__SUCCESS';

export default function getYaks(): Promise<{ yaks: Yak[] }> {
  return apiRequest('GET', GET_YAKS__ROUTE).then(response => {
    switch (response.status) {
      case GET_YAKS__SUCCESS: {
        return response.data;
      }
      default:
        throw new Error(response);
    }
  });
}
