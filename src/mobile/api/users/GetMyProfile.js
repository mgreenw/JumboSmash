// @flow

// Self contained API file for GetMyProfile

import { timeout } from "../utils/timeout";
import { MY_PROFILE__ROUTE } from "../routes";
import type { UserProfile } from "mobile/reducers";

const GET_PROFILE__SUCCESS = "GET_PROFILE__SUCCESS";
const GET_PROFILE__NOT_FOUND = "GET_PROFILE__PROFILE_NOT_FOUND";

type getProfileResponse__SUCCESS = {
  status: string,
  profile: UserProfile
};

type getProfileResponse__NOT_FOUND = {};

type request = {
  token: string
};

export default function getTokenUtln(
  request: request,
  callback__SUCCESS: (
    response: getProfileResponse__SUCCESS,
    request: request
  ) => void,
  callback__NOT_FOUND: (
    response: getProfileResponse__NOT_FOUND,
    request: request
  ) => void,
  callback__ERROR: (response: any, request: request) => void
) {
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
      // We use this to ASSERT what the type of the response is.
      switch (response.status) {
        case GET_PROFILE__SUCCESS:
          callback__SUCCESS(response, request);
          break;
        case GET_PROFILE__NOT_FOUND:
          callback__NOT_FOUND(response, request);
          break;
        default:
          console.log("Profile Error:", response.status, response);
      }
    })
    .catch(error => {
      callback__ERROR(error, request);
    });
}
