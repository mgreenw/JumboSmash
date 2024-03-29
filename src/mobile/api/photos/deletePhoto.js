// @flow

import apiRequest from '../utils/apiRequest';
import { DELETE_PHOTO__ROUTE } from '../routes';

const DELETE_PHOTO__SUCCESS = 'DELETE_PHOTO__SUCCESS';
const DELETE_PHOTO__NOT_FOUND = 'DELETE_PHOTO__NOT_FOUND';
const DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO =
  'DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO';

// returns new photo UUID's
export default function deletePhotoApi(
  photoUuid: string
): Promise<Array<string>> {
  return apiRequest('DELETE', DELETE_PHOTO__ROUTE + photoUuid).then(
    response => {
      switch (response.status) {
        case DELETE_PHOTO__SUCCESS:
          return response.data;
        case DELETE_PHOTO__NOT_FOUND:
          throw new Error(response);
        case DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO:
          throw new Error(response);
        default:
          throw new Error(response);
      }
    }
  );
}
