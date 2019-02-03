// @flow
// NOTE: This should ONLY be used in onboarding, before a
// profile has been completed. After that, use getMyProfile

import { apiRequest } from "../utils/apiRequest";
import { GET_MY_PHOTOS__ROUTE } from "../routes";

const GET_MY_PHOTOS__SUCCESS = "GET_MY_PHOTOS__SUCCESS";

function getMyPhotos(token: string): Promise<$ReadOnlyArray<number>> {
  return apiRequest("GET", GET_MY_PHOTOS__ROUTE, token)
    .then(response => {
      switch (response.status) {
        case GET_MY_PHOTOS__SUCCESS:
          return response.photoIds;
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error };
    });
}

export { getMyPhotos };
