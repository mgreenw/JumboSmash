// @flow

// Self contained API file for GetMyProfile

import { timeout } from "../utils/timeout";
import { MY_SETTINGS__ROUTE } from "../routes";
import type { UserSettings } from "mobile/reducers";

const GET_SETTINGS__SUCCESS = "GET_SETTINGS__SUCCESS";

type request = {
  token: string
};

export default function getMyProfile(request: request): Promise<?UserSettings> {
  return timeout(
    30000,
    fetch(MY_SETTINGS__ROUTE, {
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
      console.log("get my settings response:", response);
      switch (response.status) {
        case GET_SETTINGS__SUCCESS:
          return response;
        default:
          throw (response, request);
      }
    })
    .catch(error => {
      throw (error, request);
    });
}
