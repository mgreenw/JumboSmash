// @flow
import { apiRequest } from "../utils/apiRequest";
import { MY_PROFILE__ROUTE } from "../routes";
import type { UserProfile } from "mobile/reducers";
import type { ServerProfile } from "./GetMyProfile";

const UPDATE_PROFILE__SUCCESS = "UPDATE_PROFILE__SUCCESS";
const CREATE_PROFILE__SUCCESS = "CREATE_PROFILE__SUCCESS";

function updateOrCreateMyProfile(
  token: string,
  request: UserProfile,
  method: "PATCH" | "POST"
): Promise<void> {
  return apiRequest(
    method,

    MY_PROFILE__ROUTE,
    token,
    {
      ...request,
      image1Url:
        "https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w"
    }
  )
    .then(response => {
      switch (response.status) {
        case CREATE_PROFILE__SUCCESS:
          return;
        case UPDATE_PROFILE__SUCCESS: {
          return;
        }
        default:
          throw { response };
      }
    })
    .catch(error => {
      console.log("error :()");
      throw { error, request };
    });
}

export function updateMyProfile(
  token: string,
  request: UserProfile
): Promise<void> {
  return updateOrCreateMyProfile(token, request, "PATCH");
}

export function createMyProfile(
  token: string,
  request: UserProfile
): Promise<void> {
  return updateOrCreateMyProfile(token, request, "POST");
}
