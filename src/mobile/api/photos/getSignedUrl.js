// @flow
/* eslint-disable */

import { apiRequest } from '../utils/apiRequest';
import { GET_SIGN_URL__ROUTE } from '../routes';

const SIGN_URL__SUCCESS = 'SIGN_URL__SUCCESS';

export type SignedUrlPayload = {
  url: string,
  fields: Object,
};

function getSignedUrl(token: string): Promise<SignedUrlPayload> {
  return apiRequest('GET', GET_SIGN_URL__ROUTE, token)
    .then(response => {
      switch (response.status) {
        case SIGN_URL__SUCCESS:
          return response.data;
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error };
    });
}

export { getSignedUrl };
