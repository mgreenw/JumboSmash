// @flow

import { apiRequest } from "../utils/apiRequest";
import { DELETE_PHOTO__ROUTE } from "../routes";

const DELETE_PHOTO__SUCCESS = "DELETE_PHOTO__SUCCESS";
const DELETE_PHOTO__NOT_FOUND = "DELETE_PHOTO__NOT_FOUND";
const DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO =
  "DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO";

function deletePhotoApi(
  token: string,
  photoId: number
): Promise<Array<number>> {
  return apiRequest("DELETE", DELETE_PHOTO__ROUTE + photoId, token)
    .then(response => {
      switch (response.status) {
        case DELETE_PHOTO__SUCCESS:
          return response.data;
        case DELETE_PHOTO__NOT_FOUND:
          throw { response };
        case DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO:
          throw { response };
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error };
    });
}

export { deletePhotoApi };
