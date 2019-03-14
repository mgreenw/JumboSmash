// @flow

import apiRequest from '../utils/apiRequest';
import { GET_TOKEN_UTLN__ROUTE } from '../routes';
import { AUTHORIZED } from '../sharedResponseCodes';

// Get the UTLN based on the client (infered via auth token)
export default function getClientUtln(): Promise<string> {
  return apiRequest('GET', GET_TOKEN_UTLN__ROUTE).then(response => {
    switch (response.status) {
      case AUTHORIZED: {
        return response.data.utln;
      }
      default:
        throw new Error(response);
    }
  });
}
