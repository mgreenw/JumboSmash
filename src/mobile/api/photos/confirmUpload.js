// @flow

import apiRequest from '../utils/apiRequest';
import { CONFIRM_PHOTO__ROUTE } from '../routes';

const CONFIRM_UPLOAD__SUCCESS = 'CONFIRM_UPLOAD__SUCCESS';
const CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO =
  'CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO';
const CONFIRM_UPLOAD__NO_UPLOAD_FOUND = 'CONFIRM_UPLOAD__NO_UPLOAD_FOUND';
const CONFIRM_UPLOAD__NO_AVAILABLE_SLOT = 'CONFIRM_UPLOAD__NO_AVAILABLE_SLOT';

export type SignedUrlPayload = {
  url: string,
  fields: Object
};

export default function confirmUpload(): Promise<number[]> {
  return apiRequest('GET', CONFIRM_PHOTO__ROUTE).then(response => {
    switch (response.status) {
      case CONFIRM_UPLOAD__SUCCESS:
        return response.data;
      case CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO:
        throw new Error(response);
      case CONFIRM_UPLOAD__NO_UPLOAD_FOUND:
        throw new Error(response);
      case CONFIRM_UPLOAD__NO_AVAILABLE_SLOT:
        throw new Error(response);
      default:
        throw new Error(response);
    }
  });
}
