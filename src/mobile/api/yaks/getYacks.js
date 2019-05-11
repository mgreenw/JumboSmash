// @flow
import type { Yak } from 'mobile/api/serverTypes';
import apiRequest from '../utils/apiRequest';
import { GET_YACKS__ROUTE } from '../routes';

const GET_YACKS__SUCCESS = 'GET_YACKS__SUCCESS';

export default function getYack(): Promise<{ yaks: Yak[] }> {
  return apiRequest('GET', GET_YACKS__ROUTE).then(response => {
    switch (response.status) {
      case GET_YACKS__SUCCESS: {
        return response.data.yaks;
      }
      default:
        throw new Error(response);
    }
  });
}
