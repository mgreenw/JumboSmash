// @flow
/* eslint-disable */

import type { UserProfile } from 'mobile/reducers';
import { apiRequest } from '../utils/apiRequest';
import { MY_PROFILE__ROUTE } from '../routes';

const GET_PROFILE__SUCCESS = 'GET_PROFILE__SUCCESS';
const PROFILE_SETUP_INCOMPLETE = 'PROFILE_SETUP_INCOMPLETE';

// This is how we encode profiles on the server, which is the schema of the
// profiles database
export type ServerProfile = {
  displayName: string,
  birthday: string,
  bio: string,
  photos: Array<number>,
};

type request = {
  token: string,
};

function parseProfile(apiResponse: ServerProfile): UserProfile {
  const { displayName, birthday, bio, photos } = apiResponse;
  return {
    displayName,
    birthday,
    bio,
    photoIds: photos,
  };
}

export default function getMyProfile(request: request): Promise<?UserProfile> {
  return apiRequest('GET', MY_PROFILE__ROUTE, request.token)
    .then(response => {
      switch (response.status) {
        case GET_PROFILE__SUCCESS:
          return parseProfile(response.profile);

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
