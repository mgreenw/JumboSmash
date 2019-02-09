// @flow
/* eslint-disable */

import type { UserProfile } from 'mobile/reducers';
import { apiRequest } from '../utils/apiRequest';
import { MY_PROFILE__ROUTE } from '../routes';
import type { ServerProfile } from './GetMyProfile';

const UPDATE_PROFILE__SUCCESS = 'UPDATE_PROFILE__SUCCESS';
const FINALIZE_PROFILE_SETUP__SUCCESS = 'FINALIZE_PROFILE_SETUP__SUCCESS';

function updateOrCreateMyProfile(
  token: string,
  request: UserProfile,
  method: 'PATCH' | 'POST',
): Promise<void> {
  return apiRequest(
    method,

    MY_PROFILE__ROUTE,
    token,
    request,
  )
    .then(response => {
      switch (response.status) {
        case FINALIZE_PROFILE_SETUP__SUCCESS:
          return;
        case UPDATE_PROFILE__SUCCESS: {
          return;
        }
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}

export function updateMyProfile(token: string, request: UserProfile): Promise<void> {
  return updateOrCreateMyProfile(token, request, 'PATCH');
}

export function createMyProfile(token: string, request: UserProfile): Promise<void> {
  return updateOrCreateMyProfile(token, request, 'POST');
}
