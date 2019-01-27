// @flow
import { apiRequest } from "../utils/apiRequest";
import { MY_SETTINGS__ROUTE } from "../routes";
import type { UserSettings } from "mobile/reducers";
import { mobileSettingsToServerSettings } from "mobile/api/dataConversion";

const UPDATE_MY_SETTINGS__SUCCESS = "UPDATE_SETTINGS__SUCCESS";

export default function updateMySettings(
  token: string,
  request: UserSettings
): Promise<void> {
  return apiRequest(
    "PATCH",
    MY_SETTINGS__ROUTE,
    token,
    mobileSettingsToServerSettings(request)
  )
    .then(response => {
      switch (response.status) {
        case UPDATE_MY_SETTINGS__SUCCESS:
          return;
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}
