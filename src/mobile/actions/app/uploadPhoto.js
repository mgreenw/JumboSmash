// @flow

import type { Dispatch } from 'mobile/reducers';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import getSignedUrl from 'mobile/api/photos/getSignedUrl';
import uploadPhotoToS3 from 'mobile/api/photos/uploadPhoto';
import confirmUploadAction from 'mobile/api/photos/confirmUpload';

export type UploadPhotoInitiated_Action = {
  type: 'UPLOAD_PHOTO__INITIATED',
  payload: {},
  meta: {}
};
export type UploadPhotoCompleted_Action = {
  type: 'UPLOAD_PHOTO__COMPLETED',
  payload: {
    photoIds: number[]
  },
  meta: {}
};

export type UploadPhotoFailed_Action = {
  type: 'UPLOAD_PHOTO__FAILED',
  payload: {},
  meta: {}
};

function initiate(): UploadPhotoInitiated_Action {
  return {
    type: 'UPLOAD_PHOTO__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(photoIds: number[]): UploadPhotoCompleted_Action {
  return {
    type: 'UPLOAD_PHOTO__COMPLETED',
    payload: {
      photoIds
    },
    meta: {}
  };
}

function fail(): UploadPhotoFailed_Action {
  return {
    type: 'SEND_MESSAGE__FAILED',
    payload: {},
    meta: {}
  };
}

// Invariant: only one of these actions in progress at a time.
// We can enforce this via the inProgress property if needed, or even bind the uri to the state.
export default (uri: string) => (dispatch: Dispatch) => {
  dispatch(initiate());
  getSignedUrl()
    .then(payload => {
      uploadPhotoToS3(uri, payload).then(success => {
        if (success) {
          confirmUploadAction().then(photoIds => {
            dispatch(complete(photoIds));
          });
        } else {
          throw new Error('Error Uploading Photo');
        }
      });
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
