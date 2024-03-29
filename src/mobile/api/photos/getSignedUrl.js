// @flow

import apiRequest from '../utils/apiRequest';
import { GET_SIGN_URL__ROUTE } from '../routes';

const SIGN_URL__SUCCESS = 'SIGN_URL__SUCCESS';

export type SignedUrlPayload = {
  url: string,
  fields: Object
};

export default function getSignedUrl(): Promise<SignedUrlPayload> {
  return apiRequest('GET', GET_SIGN_URL__ROUTE).then(response => {
    switch (response.status) {
      case SIGN_URL__SUCCESS:
        return response.data;
      default:
        throw new Error(response);
    }
  });
}
