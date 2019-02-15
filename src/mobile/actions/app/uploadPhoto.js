// @flow
/* eslint-disable */

import type { Dispatch } from 'mobile/reducers';
import DevTesting from 'mobile/utils/DevTesting';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import { getSignedUrl } from 'mobile/api/photos/getSignedUrl';
import { uploadPhotoToS3 } from 'mobile/api/photos/uploadPhoto';
import { confirmUpload } from 'mobile/api/photos/confirmUpload';

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

// TODO: catch errors, e.g. the common network timeout.
export function uploadPhotoAction(uri: string) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    getSignedUrl()
      .then(payload => {
        uploadPhotoToS3(uri, payload).then(success => {
          if (success) {
            confirmUpload().then(photoIds => {
              dispatch(complete(photoIds));
            });
          } else {
            throw 'Error Uploading Photo';
          }
        });
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  };
}
