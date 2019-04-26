// @flow

import type { Dispatch } from 'mobile/reducers';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import deletePhotoApi from 'mobile/api/photos/deletePhoto';

export type DeletePhotoInitiated_Action = {
  type: 'DELETE_PHOTO__INITIATED',
  payload: {},
  meta: {}
};
export type DeletePhotoCompleted_Action = {
  type: 'DELETE_PHOTO__COMPLETED',
  payload: {
    photoUuids: Array<string>
  },
  meta: {}
};

export type DeletePhotoFailed_Action = {
  type: 'DELETE_PHOTO__FAILED',
  payload: {},
  meta: {}
};

function initiate(): DeletePhotoInitiated_Action {
  return {
    type: 'DELETE_PHOTO__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(photoUuids: Array<string>): DeletePhotoCompleted_Action {
  return {
    type: 'DELETE_PHOTO__COMPLETED',
    payload: {
      photoUuids
    },
    meta: {}
  };
}

function fail(): DeletePhotoFailed_Action {
  return {
    type: 'DELETE_PHOTO__FAILED',
    payload: {},
    meta: {}
  };
}

export default (photoUuid: string) => (dispatch: Dispatch) => {
  dispatch(initiate());
  deletePhotoApi(photoUuid)
    .then(newPhotoIds => {
      dispatch(complete(newPhotoIds));
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
