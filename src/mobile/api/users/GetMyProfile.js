// @flow

// Self contained API file for GetMyProfile

import { timeout } from "../utils/timeout";
import { MY_PROFILE__ROUTE } from "../routes";
import type { UserProfile } from "mobile/reducers";

const GET_PROFILE__SUCCESS = "GET_PROFILE__SUCCESS";
const PROFILE_SETUP_INCOMPLETE = "PROFILE_SETUP_INCOMPLETE";

// This is how we encode profiles on the server, which is the schema of the
// profiles database
type ServerProfile = {
  display_name: string,
  birthday: string,
  bio: string,
  image1_url: string,
  image2_url: string,
  image3_url: string,
  image4_url: string
};

type request = {
  token: string
};

function parseProfile(apiResponse: ServerProfile): UserProfile {
  return {
    displayName: apiResponse.display_name,
    birthday: apiResponse.birthday, // TODO: convert
    bio: apiResponse.bio,
    images: [
      apiResponse.image1_url,
      apiResponse.image2_url,
      apiResponse.image3_url,
      apiResponse.image4_url
    ]
  };
}

export default function getMyProfile(request: request): Promise<?UserProfile> {
  return timeout(
    30000,
    fetch(MY_PROFILE__ROUTE, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: request.token
      }
    })
  )
    .then(response => response.json())
    .then(response => {
      console.log(response);
      switch (response.status) {
        case GET_PROFILE__SUCCESS:
          return parseProfile(response);

        // on an incomplete profile, return a null UserProfile. We use this
        // to set profile to null in the Redux State
        case PROFILE_SETUP_INCOMPLETE:
          return null;
        default:
          throw (response, request);
      }
    })
    .catch(error => {
      throw (error, request);
    });
}
