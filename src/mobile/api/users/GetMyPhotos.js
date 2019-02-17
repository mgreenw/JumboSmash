// @flow

// NOTE: This should ONLY be used in onboarding, before a
// profile has been completed. After that, use getMyProfile

import apiRequest from '../utils/apiRequest';
import { GET_MY_PHOTOS__ROUTE } from '../routes';

const GET_MY_PHOTOS__SUCCESS = 'GET_MY_PHOTOS__SUCCESS';

export default function getMyPhotos(): Promise<number[]> {
  return apiRequest('GET', GET_MY_PHOTOS__ROUTE)
    .then(response => {
      switch (response.status) {
        case GET_MY_PHOTOS__SUCCESS:
          return response.data;
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error };
    });
}
