// @flow

import { apiRequest } from "../utils/apiRequest";
import { MY_PROFILE__ROUTE } from "../routes";
import type { UserProfile } from "mobile/reducers";

const GET_PROFILE__SUCCESS = "GET_PROFILE__SUCCESS";
const PROFILE_SETUP_INCOMPLETE = "PROFILE_SETUP_INCOMPLETE";

// This is how we encode profiles on the server, which is the schema of the
// profiles database
export type ServerProfile = {
  fields: {
    displayName: string,
    birthday: string,
    bio: string,
  },
  photoIds: Array<number>
};

type request = {
  token: string
};

function parseProfile(apiResponse: ServerProfile): UserProfile {
  const { fields, photoIds } = apiResponse;
  return {
    ...fields,
    photoIds,
  };
}

export default function getMyProfile(request: request): Promise<?UserProfile> {
  return apiRequest("GET", MY_PROFILE__ROUTE, request.token)
    .then(response => {
      switch (response.status) {
        case GET_PROFILE__SUCCESS:
          return parseProfile(response.data);

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
