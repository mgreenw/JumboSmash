// @flow

import type { ProfileFields, UserProfile } from 'mobile/reducers';
import apiRequest from '../utils/apiRequest';
import { MY_PROFILE__ROUTE } from '../routes';

const UPDATE_PROFILE__SUCCESS = 'UPDATE_PROFILE__SUCCESS';
const FINALIZE_PROFILE_SETUP__SUCCESS = 'FINALIZE_PROFILE_SETUP__SUCCESS';

function updateOrCreateMyProfileFields(
  request: ProfileFields,
  method: 'PATCH' | 'POST'
): Promise<ProfileFields> {
  return apiRequest(method, MY_PROFILE__ROUTE, request).then(response => {
    switch (response.status) {
      // We get back a UserProfile, but only care about the fields.
      // TODO: have, serverside, only return the fields
      case FINALIZE_PROFILE_SETUP__SUCCESS:
        // These eslint disables are so we can use Flow to assert the types of the responses.
        // eslint-disable-next-line no-unused-expressions
        (response.data: UserProfile);
        return response.data.fields;
      case UPDATE_PROFILE__SUCCESS: {
        // eslint-disable-next-line no-unused-expressions
        (response.data: UserProfile);
        return response.data.fields;
      }
      default:
        throw new Error(response);
    }
  });
}

export function updateMyProfileFields(
  request: ProfileFields
): Promise<ProfileFields> {
  return updateOrCreateMyProfileFields(request, 'PATCH');
}

export function createMyProfileFields(
  request: ProfileFields
): Promise<ProfileFields> {
  return updateOrCreateMyProfileFields(request, 'POST');
}
