// @flow
import type { Dispatch, GetState } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserSettings, UserProfile } from "mobile/reducers";
import getMyProfile from "mobile/api/users/GetMyProfile";
import getMySettings from "mobile/api/users/GetMySettings";
import { apiErrorHandler } from "mobile/actions/apiErrorHandler";
import { getMyPhotos } from "mobile/api/users/GetMyPhotos";

export type LoadAppInitiated_Action = { type: "LOAD_APP__INITIATED" };
export type LoadAppCompleted_Action = {
  type: "LOAD_APP__COMPLETED",
  onboardingCompleted: boolean,
  profile: UserProfile,
  settings: UserSettings
};

function initiate(): LoadAppInitiated_Action {
  return {
    type: "LOAD_APP__INITIATED"
  };
}

function complete(
  profile: ?UserProfile,
  settings: ?UserSettings,
  onboardingCompleted: boolean,
  photos: ?$ReadOnlyArray<number>
): LoadAppCompleted_Action {
  DevTesting.log("load app complete; profile && settigs: ", profile, settings);
  return {
    type: "LOAD_APP__COMPLETED",
    onboardingCompleted,
    profile: profile || {
      bio: "",
      birthday: "",
      displayName: "",
      photoIds: photos || [] // incase partial photo uploading in onboarding
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
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function loadApp() {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      getMyProfile({
        token
      })
        .then(profile => {
          // if profile is null, onboarding has not been completed, though
          // some photos may have been uploaded.
          if (profile === null) {
            getMyPhotos(token).then(photoIds => {
              dispatch(complete(null, null, false, photoIds));
            });
          } else {
            getMySettings({
              token
            }).then(settings => {
              dispatch(complete(profile, settings, true));
            });
          }
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  };
}
