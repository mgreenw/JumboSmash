// @flow

import apiRequest from '../utils/apiRequest';
import { REPORT_USER__ROUTE } from '../routes';

const REPORT__SUCCESS = 'REPORT__SUCCESS';

export default function reportUser(
  userId: number,
  message: string,
  reasonCode: string,
  block: boolean
): Promise<{ status: string, message?: string }> {
  return apiRequest('POST', REPORT_USER__ROUTE, {
    userId,
    message,
    reasonCode,
    block
  })
    .then(response => {
      switch (response.status) {
        case REPORT__SUCCESS: {
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
