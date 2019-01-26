// @flow
import type { Dispatch, GetState } from "redux";
import DevTesting from "../../../utils/DevTesting";
import { apiErrorHandler } from "mobile/actions/apiErrorHandler";

export type UploadPhotoInitiated_Action = {
  type: "UPLOAD_PHOTO__INITIATED"
};
export type UploadPhotoCompleted_Action = {
  type: "UPLOAD_PHOTO__COMPLETED"
};

function initiate(): UploadPhotoInitiated_Action {
  return {
    type: "UPLOAD_PHOTO__INITIATED"
  };
}

function complete(): UploadPhotoCompleted_Action {
  return {
    type: "UPLOAD_PHOTO__COMPLETED"
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function uploadPhoto(uri: string) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    // updateMySettings(token, settings)
    //   .then(() => {
    //     createMyProfile(token, profile).then(() => {
    //       dispatch(complete());
    //     });
    //   })
    //   .catch(error => {
    //     dispatch(apiErrorHandler(error));
    //   });
  };
}
