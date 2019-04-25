// @flow

import type { ServerProfile } from 'mobile/api/serverTypes';
import apiRequest from '../utils/apiRequest';
import { GET_PROFILE__ROUTE__GENERATOR } from '../routes';

const GET_PROFILE__SUCCESS = 'GET_PROFILE__SUCCESS';

export default function getProfile(userId: number): Promise<ServerProfile> {
  const route = GET_PROFILE__ROUTE__GENERATOR(userId);
  return apiRequest('GET', route).then(response => {
    switch (response.status) {
      case GET_PROFILE__SUCCESS:
        return response.data;
      default:
        throw new Error(response);
    }
  });
}
