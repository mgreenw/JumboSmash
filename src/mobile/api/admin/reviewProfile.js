// @flow

import type { ServerClassmate, Capabilities } from 'mobile/api/serverTypes';
import apiRequest from 'mobile/api/utils/apiRequest';
import { REVIEW_PROFILE__ROUTE__GENERATOR } from 'mobile/api/routes';

const REVIEW_PROFILE__SUCCESS = 'REVIEW_PROFILE__SUCCESS';

export default function getClassmates(
  password: string,
  userId: number,
  request: {
    updatedCapabilites: Capabilities,
    previousCapabilities: Capabilities,
    comment: string
  }
): Promise<ServerClassmate> {
  const route = REVIEW_PROFILE__ROUTE__GENERATOR(userId);
  return apiRequest('POST', route, request, password).then(response => {
    switch (response.status) {
      case REVIEW_PROFILE__SUCCESS:
        return response.data.classmate;
      default:
        throw new Error(response);
    }
  });
}
