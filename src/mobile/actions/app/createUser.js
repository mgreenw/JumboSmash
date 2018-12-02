// @flow
import type { Dispatch } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserProfile, UserSettings } from "mobile/reducers";
import { createMyProfile } from "mobile/api/users/updateMyProfile";
import updateMySettings from "mobile/api/users/updateMySettings";

export const CREATE_PROFILE_AND_SETTINGS__INITIATED =
  "CREATE_PROFILE_AND_SETTINGS__INITIATED";
export const CREATE_PROFILE_AND_SETTINGS__COMPLETED =
  "CREATE_PROFILE_AND_SETTINGS__COMPLETED";

function initiate() {
  return {
    type: CREATE_PROFILE_AND_SETTINGS__INITIATED
  };
}

function complete() {
  return {
    type: CREATE_PROFILE_AND_SETTINGS__COMPLETED
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function createUser(
  token: string,
  profile: UserProfile,
  settings: UserSettings
) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      // Important that they occur in this order; we use a created profile
      // to determine that onboarding is done, so settings must be created first
      updateMySettings(token, settings)
        .then(() => {
          DevTesting.fakeLatency(() => {
            createMyProfile(token, profile).then(() => {
              dispatch(complete());
            });
          });
        })
        .catch(error => {
          console.log("Error in Creating User: ", error);
        });
    });
  };
}
