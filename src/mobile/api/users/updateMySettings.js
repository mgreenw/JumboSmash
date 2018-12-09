// @flow
import { timeout } from "../utils/timeout";
import { MY_SETTINGS__ROUTE } from "../routes";
import type { UserSettings } from "mobile/reducers";

const UPDATE_MY_SETTINGS__SUCCESS = "UPDATE_SETTINGS__SUCCESS";

export default function updateMySettings(
  token: string,
  request: UserSettings
): Promise<void> {
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
      switch (response.status) {
        case UPDATE_MY_SETTINGS__SUCCESS:
          return;
        default:
          throw (response, request);
      }
    })
    .catch(error => {
      throw (error, request);
    });
}
