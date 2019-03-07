// @flow

import type { UserProfile } from 'mobile/reducers';
import apiRequest from '../utils/apiRequest';
import { MY_PROFILE__ROUTE } from '../routes';

const GET_PROFILE__SUCCESS = 'GET_PROFILE__SUCCESS';
const PROFILE_SETUP_INCOMPLETE = 'PROFILE_SETUP_INCOMPLETE';

export default function getMyProfile(): Promise<?UserProfile> {
  return apiRequest('GET', MY_PROFILE__ROUTE).then(response => {
    switch (response.status) {
      case GET_PROFILE__SUCCESS:
        return response.data;

      // on an incomplete profile, return a null UserProfile. We use this
      // to set profile to null in the Redux State
      case PROFILE_SETUP_INCOMPLETE:
        return null;
      default:
        throw new Error(response);
    }
  });
}
