// @flow

import type { UserSettings, UserProfile, Dispatch } from 'mobile/reducers';
import getMyProfile from 'mobile/api/users/GetMyProfile';
import getMySettings from 'mobile/api/users/GetMySettings';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import getMyPhotos from 'mobile/api/users/GetMyPhotos';

export type LoadAppInitiated_Action = {
  type: 'LOAD_APP__INITIATED',
  payload: {},
  meta: {}
};
export type LoadAppCompleted_Action = {
  type: 'LOAD_APP__COMPLETED',
  payload: {
    onboardingCompleted: boolean,
    profile: UserProfile,
    settings: UserSettings
  },
  meta: {}
};

function initiate(): LoadAppInitiated_Action {
  return {
    type: 'LOAD_APP__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(
  profile: ?UserProfile,
  settings: ?UserSettings,
  onboardingCompleted: boolean,
  photoIds: ?(number[])
): LoadAppCompleted_Action {
  return {
    type: 'LOAD_APP__COMPLETED',
    payload: {
      onboardingCompleted,
      profile: profile || {
        fields: {
          bio: '',
          birthday: '',
          displayName: ''
        },
        photoIds: photoIds || [] // incase partial photo uploading in onboarding
      },
      settings: settings || {
        useGenders: {
          male: false,
          female: false,
          nonBinary: false
        },
        wantGenders: {
          male: false,
          female: false,
          nonBinary: false
        }
      }
    },
    meta: {}
  };
}

export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  getMyProfile()
    .then(profile => {
      // if profile is null, onboarding has not been completed, though
      // some photos may have been uploaded.
      if (profile === null) {
        getMyPhotos().then(photoIds => {
          dispatch(complete(null, null, false, photoIds));
        });
      } else {
        getMySettings().then(settings => {
          dispatch(complete(profile, settings, true));
        });
      }
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
    });
};
