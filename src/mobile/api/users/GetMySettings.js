// @flow

import { apiRequest } from "../utils/apiRequest";
import { MY_SETTINGS__ROUTE } from "../routes";
import type { UserSettings } from "mobile/reducers";

const GET_SETTINGS__SUCCESS = "GET_SETTINGS__SUCCESS";

type request = {
  token: string
};

export default function getMyProfile(request: request): Promise<?UserSettings> {
  return apiRequest("GET", MY_SETTINGS__ROUTE, request.token)
    .then(response => {
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
