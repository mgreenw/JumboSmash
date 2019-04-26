// @flow

import type { UserSettings, UserProfile, Dispatch } from 'mobile/reducers';
import getMyProfile from 'mobile/api/users/GetMyProfile';
import getMySettings from 'mobile/api/users/GetMySettings';
import getClientUtln from 'mobile/api/auth/getClientUtln';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import getMyPhotos from 'mobile/api/users/GetMyPhotos';
import checkLaunchDate from 'mobile/api/meta/checkLaunchDate';
import Sentry from 'sentry-expo';
import type { LaunchDateStatus } from 'mobile/api/serverTypes';

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
    launchDateStatus: LaunchDateStatus
  },
  meta: {}
};

export type LoadAppFailed_Action = {
  type: 'LOAD_APP__FAILED',
  payload: {},
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
  launchDateStatus: LaunchDateStatus,
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
        isAdmin: false,
        canBeActiveInScenes: false
      },
      launchDateStatus
    },
    meta: {}
  };
}

function fail(): LoadAppFailed_Action {
  return {
    type: 'LOAD_APP__FAILED',
    payload: {},
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
    .then(([launchDateStatus, profile, photoIds, settings, utln]) => {
      Sentry.setUserContext({
        username: utln
      });
      dispatch(
        complete(
          profile,
          settings,
          profile !== null,
          launchDateStatus,
          photoIds
        )
      );
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
