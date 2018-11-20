// @flow

// Self contained API file for GetMyProfile

import { timeout } from "../utils/timeout";
import { MY_SETTINGS__ROUTE } from "../routes";
import type { UserSettings } from "mobile/reducers";

const UPDATE_MY_SETTINGS__SUCCESS = "UPDATE_SETTINGS__SUCCESS";

type request = {
  token: string,
  settings: UserSettings
};

export function updateMySettings(request: request): Promise<void> {
  console.log(MY_SETTINGS__ROUTE);
  return timeout(
    30000,
    fetch(MY_SETTINGS__ROUTE, {
      method: "PATCH",
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
        case UPDATE_MY_SETTINGS__SUCCESS:
          console.log("success response code!");
          return;
        default:
          throw (response, request);
      }
    })
    .catch(error => {
      throw (error, request);
    });
}
