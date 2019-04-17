// @flow

import apiRequest from '../utils/apiRequest';
import { LOGOUT__ROUTE } from '../routes';

const SUCCESS = 'LOGOUT__SUCCESS';

export default function logout(): Promise<void> {
  return apiRequest('POST', LOGOUT__ROUTE).then(response => {
    switch (response.status) {
      case SUCCESS: {
        return;
      }
      default:
        throw new Error(response);
    }
  });
}
