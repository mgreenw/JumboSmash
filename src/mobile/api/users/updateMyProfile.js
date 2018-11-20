// @flow
import { timeout } from "../utils/timeout";
import { MY_PROFILE__ROUTE } from "../routes";
import type { UserProfile } from "mobile/reducers";
import type { ServerProfile } from "./getMyProfile";

const UPDATE_PROFILE__SUCCESS = "UPDATE_PROFILE__SUCCESS";
const CREATE_PROFILE__SUCCESS = "CREATE_PROFILE__SUCCESS";

function updateOrCreateMyProfile(
  token: string,
  request: UserProfile,
  method: "PATCH" | "POST"
): Promise<void> {
  return timeout(
    30000,
    fetch(MY_PROFILE__ROUTE, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        ...request,
        image1Url:
          "https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w"
      })
    })
  )
    .then(response => response.json())
    .then(response => {
      console.log(response);
      switch (response.status) {
        case (UPDATE_PROFILE__SUCCESS, CREATE_PROFILE__SUCCESS):
          return;
        default:
          throw (response, request);
      }
    })
    .catch(error => {
      console.log("updateOrCreateMyProfile Error:", error);
      throw (error, request);
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
