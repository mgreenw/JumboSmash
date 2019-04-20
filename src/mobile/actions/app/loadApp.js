// @flow

import type { UserSettings, UserProfile, Dispatch } from 'mobile/reducers';
import getMyProfile from 'mobile/api/users/GetMyProfile';
import getMySettings from 'mobile/api/users/GetMySettings';
import getClientUtln from 'mobile/api/auth/getClientUtln';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import getMyPhotos from 'mobile/api/users/GetMyPhotos';
import checkLaunchDate from 'mobile/api/meta/checkLaunchDate';
import Sentry from 'sentry-expo';

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
    settings: UserSettings,
    launchDate: Date
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
  launchDate: Date,
  photoUuids: ?(string[])
): LoadAppCompleted_Action {
  return {
    type: 'LOAD_APP__COMPLETED',
    payload: {
      onboardingCompleted,
      profile: profile || {
        fields: {
          bio: '',
          birthday: '',
          displayName: '',
          postgradRegion: null, // optional field
          freshmanDorm: null
        },
        photoUuids: photoUuids || [] // incase partial photo uploading in onboarding
      },
      settings: settings || {
        identifyAsGenders: {
          man: false,
          woman: false,
          nonBinary: false
        },
        lookingForGenders: {
          man: false,
          woman: false,
          nonBinary: false
        },
        // start all selected true untill we add to onboarding
        activeScenes: {
          smash: false,
          social: false,
          stone: false
        },
        notificationsEnabled: false,
        expoPushToken: null
      },
      launchDate
    },
    meta: {}
  };
}

export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  checkLaunchDate()
    .then(launchDate => {
      getMyProfile().then(profile => {
        // if profile is null, onboarding has not been completed, though
        // some photos may have been uploaded.
        if (profile === null || profile === undefined) {
          getMyPhotos().then(photoUuids => {
            dispatch(complete(null, null, false, launchDate, photoUuids));
          });
        } else {
          getMySettings().then(settings => {
            getClientUtln().then(utln => {
              // TODO: add UserId, need it retrieved somewhere, preferably the same utln endpoint
              Sentry.setUserContext({
                username: utln
              });
              Sentry.captureMessage('User Logged In!', {
                level: 'info'
              });

              dispatch(complete(profile, settings, true, launchDate));
            });
          });
        }
      });
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
    });
};
