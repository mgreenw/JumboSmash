// @flow
import type { Dispatch, GetState } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserProfile, UserSettings } from "mobile/reducers";
import { createMyProfile } from "mobile/api/users/updateMyProfile";
import updateMySettings from "mobile/api/users/updateMySettings";
import { apiErrorHandler } from "mobile/actions/apiErrorHandler";

export type CreateProfileAndSettingsInitiated_Action = {
  type: "CREATE_PROFILE_AND_SETTINGS__INITIATED"
};
export type CreateProfileAndSettingsCompleted_Action = {
  type: "CREATE_PROFILE_AND_SETTINGS__COMPLETED"
};

function initiate(): CreateProfileAndSettingsInitiated_Action {
  return {
    type: "CREATE_PROFILE_AND_SETTINGS__INITIATED"
  };
}

function complete(): CreateProfileAndSettingsCompleted_Action {
  return {
    type: "CREATE_PROFILE_AND_SETTINGS__COMPLETED"
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function createUser(profile: UserProfile, settings: UserSettings) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      // Important that they occur in this order; we use a created profile
      // to determine that onboarding is done, so settings must be created first
      updateMySettings(token, settings)
        .then(() => {
          createMyProfile(token, profile).then(() => {
            dispatch(complete());
          });
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  };
}
