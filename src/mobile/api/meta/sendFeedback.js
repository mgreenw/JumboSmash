// @flow

import apiRequest from '../utils/apiRequest';
import { SEND_FEEDBACK__ROUTE } from '../routes';

const SEND_FEEDBACK__SUCCESS = 'SEND_FEEDBACK__SUCCESS';

export default function sendFeedback(
  message: string
): Promise<{ status: string, message?: string }> {
  return apiRequest('POST', SEND_FEEDBACK__ROUTE, {
    message,
    reasonCode: 'FEEDBACK'
  })
    .then(response => {
      switch (response.status) {
        case SEND_FEEDBACK__SUCCESS: {
          return response.data;
        }
        default: {
          throw new Error(response);
        }
      }
    })
    .catch(error => {
      throw new Error(error);
    });
}
