// @flow
/* eslint-disable */

import type { UserProfile } from 'mobile/reducers';
import { apiRequest } from '../utils/apiRequest';
import { MY_PROFILE__ROUTE } from '../routes';

const GET_PROFILE__SUCCESS = 'GET_PROFILE__SUCCESS';
const PROFILE_SETUP_INCOMPLETE = 'PROFILE_SETUP_INCOMPLETE';

type request = {
  token: string,
};

export default function getMyProfile(request: request): Promise<?UserProfile> {
  return apiRequest('GET', MY_PROFILE__ROUTE, request.token)
    .then(response => {
      switch (response.status) {
        case GET_PROFILE__SUCCESS:
          return response.data;

        // on an incomplete profile, return a null UserProfile. We use this
        // to set profile to null in the Redux State
        case PROFILE_SETUP_INCOMPLETE:
          return null;
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}
