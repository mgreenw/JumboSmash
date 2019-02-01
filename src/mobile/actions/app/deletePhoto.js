// @flow
import type { Dispatch, GetState } from "redux";
import DevTesting from "mobile/utils/DevTesting";
import { apiErrorHandler } from "mobile/actions/apiErrorHandler";
import { deletePhotoApi } from "mobile/api/photos/deletePhoto";

export type DeletePhotoInitiated_Action = {
  type: "DELETE_PHOTO__INITIATED"
};
export type DeletePhotoCompleted_Action = {
  type: "DELETE_PHOTO__COMPLETED",
  photoIds: Array<number>
};

function initiate(): DeletePhotoInitiated_Action {
  return {
    type: "DELETE_PHOTO__INITIATED"
  };
}

function complete(photoIds: Array<number>): DeletePhotoCompleted_Action {
  return {
    type: "DELETE_PHOTO__COMPLETED",
    photoIds
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function deletePhoto(photoId: number) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    deletePhotoApi(token, photoId)
      .then(newPhotoIds => {
        dispatch(complete(newPhotoIds));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  };
}
