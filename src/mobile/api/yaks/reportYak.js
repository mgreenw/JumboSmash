// @flow

import apiRequest from '../utils/apiRequest';
import { REPORT_YAK__ROUTE__GENERATOR } from '../routes';

const REPORT_YAK__SUCCESS = 'REPORT_YAK__SUCCESS';

export default function reportUser(
  yakId: number,
  message: string,
  reasonCode: string
): Promise<{ status: string, message?: string }> {
  return apiRequest('POST', REPORT_YAK__ROUTE__GENERATOR(yakId), {
    message: message || 'NO MESSAGE', // just in case (it's hack-yak time!)
    reasonCode
  })
    .then(response => {
      switch (response.status) {
        case REPORT_YAK__SUCCESS: {
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
