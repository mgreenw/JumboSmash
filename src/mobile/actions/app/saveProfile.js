// @flow
/* eslint-disable */

import type { Dispatch, GetState } from 'redux';
import type { UserProfile } from 'mobile/reducers';
import { updateMyProfile } from 'mobile/api/users/updateMyProfile';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

export type SaveProfileInitiated_Action = {
  type: 'SAVE_PROFILE__INITIATED',
  payload: {},
  meta: {},
};
export type SaveProfileCompleted_Action = {
  type: 'SAVE_PROFILE__COMPLETED',
  payload: {
    profile: UserProfile,
  },
  meta: {},
};

function initiate(): SaveProfileInitiated_Action {
  return {
    type: 'SAVE_PROFILE__INITIATED',
    payload: {},
    meta: {},
  };
}

function complete(profile: UserProfile): SaveProfileCompleted_Action {
  return {
    type: 'SAVE_PROFILE__COMPLETED',
    payload: {
      profile,
    },
    meta: {},
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function saveProfile(profile: UserProfile) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      updateMyProfile(token, profile)
        .then(() => {
          dispatch(complete(profile));
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  };
}
