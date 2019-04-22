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
          freshmanDorm: null,
          springFlingAct: null,
          springFlingActArtist: null
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
        expoPushToken: null,
        isAdmin: false
      },
      launchDate
    },
    meta: {}
  };
}

export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  Promise.all([
    checkLaunchDate(),
    getMyProfile(),
    getMyPhotos(),
    getMySettings(),
    getClientUtln()
  ])
    .then(([launchDate, profile, photoIds, settings, utln]) => {
      Sentry.setUserContext({
        username: utln
      });
      /* 
      Commeting this out so we don't burn through sentry limits
      Sentry.captureMessage('User Logged In!', {
        level: 'info'
      }); */

      dispatch(
        complete(profile, settings, profile !== null, launchDate, photoIds)
      );
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
    });
};
