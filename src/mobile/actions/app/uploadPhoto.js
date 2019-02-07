// @flow
import type { Dispatch, GetState } from "redux";
import DevTesting from "mobile/utils/DevTesting";
import { apiErrorHandler } from "mobile/actions/apiErrorHandler";
import { getSignedUrl } from "mobile/api/photos/getSignedUrl";
import { uploadPhotoToS3 } from "mobile/api/photos/uploadPhoto";
import { confirmUpload } from "mobile/api/photos/confirmUpload";

export type UploadPhotoInitiated_Action = {
  type: "UPLOAD_PHOTO__INITIATED"
};
export type UploadPhotoCompleted_Action = {
  type: "UPLOAD_PHOTO__COMPLETED",
  photoIds: number[]
};

function initiate(): UploadPhotoInitiated_Action {
  return {
    type: "UPLOAD_PHOTO__INITIATED"
  };
}

function complete(photoIds: number[]): UploadPhotoCompleted_Action {
  return {
    type: "UPLOAD_PHOTO__COMPLETED",
    photoIds
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function uploadPhoto(uri: string) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    getSignedUrl(token)
      .then(payload => {
        uploadPhotoToS3(uri, payload).then(success => {
          if (success) {
            confirmUpload(token).then(photoIds => {
              dispatch(complete(photoIds));
            });
          } else {
            throw "Error Uploading Photo";
          }
        });
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  };
}
