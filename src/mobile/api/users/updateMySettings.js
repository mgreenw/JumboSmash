// @flow
import { timeout } from "../utils/timeout";
import { MY_SETTINGS__ROUTE } from "../routes";
import type { UserSettings } from "mobile/reducers";

const UPDATE_MY_SETTINGS__SUCCESS = "UPDATE_SETTINGS_SUCCESS";

export default function updateMySettings(
  token: string,
  request: UserSettings
): Promise<void> {
  console.log(MY_SETTINGS__ROUTE);
  return timeout(
    30000,
    fetch(MY_SETTINGS__ROUTE, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(request)
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
      console.log("updateMySettings Error:", error);
      throw (error, request);
    });
}
