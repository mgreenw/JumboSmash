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
    photoIds: Array<number>
  },
  meta: {}
};

function initiate(): DeletePhotoInitiated_Action {
  return {
    type: 'DELETE_PHOTO__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(photoIds: Array<number>): DeletePhotoCompleted_Action {
  return {
    type: 'DELETE_PHOTO__COMPLETED',
    payload: {
      photoIds
    },
    meta: {}
  };
}
export default (photoId: number) => (dispatch: Dispatch) => {
  dispatch(initiate());
  deletePhotoApi(photoId)
    .then(newPhotoIds => {
      dispatch(complete(newPhotoIds));
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
    });
};
