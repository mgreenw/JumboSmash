// @flow
/* eslint-disable */

import type { ProfileFields, UserProfile } from 'mobile/reducers';
import { apiRequest } from '../utils/apiRequest';
import { MY_PROFILE__ROUTE } from '../routes';

const UPDATE_PROFILE__SUCCESS = 'UPDATE_PROFILE__SUCCESS';
const FINALIZE_PROFILE_SETUP__SUCCESS = 'FINALIZE_PROFILE_SETUP__SUCCESS';

function updateOrCreateMyProfileFields(
  token: string,
  request: ProfileFields,
  method: 'PATCH' | 'POST',
): Promise<ProfileFields> {
  return apiRequest(method, MY_PROFILE__ROUTE, token, request)
    .then(response => {
      switch (response.status) {
        // We get back a UserProfile, but only care about the fields.
        // TODO: have, serverside, only return the fields
        case FINALIZE_PROFILE_SETUP__SUCCESS:
          (response.data: UserProfile);
          return response.data.fields;
        case UPDATE_PROFILE__SUCCESS: {
          (response.data: UserProfile);
          return response.data.fields;
        }
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}

export function updateMyProfileFields(
  token: string,
  request: ProfileFields,
): Promise<ProfileFields> {
  return updateOrCreateMyProfileFields(token, request, 'PATCH');
}

export function createMyProfileFields(
  token: string,
  request: ProfileFields,
): Promise<ProfileFields> {
  return updateOrCreateMyProfileFields(token, request, 'POST');
}
