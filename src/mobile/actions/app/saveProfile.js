// @flow
import type { Dispatch, GetState } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserProfile } from "mobile/reducers";
import { updateMyProfile } from "mobile/api/users/updateMyProfile";

export type SaveProfileInitiated_Action = {
  type: "SAVE_PROFILE__INITIATED"
};
export type SaveProfileCompleted_Action = {
  type: "SAVE_PROFILE__COMPLETED",
  profile: UserProfile
};

function initiate(): SaveProfileInitiated_Action {
  return {
    type: "SAVE_PROFILE__INITIATED"
  };
}

function complete(profile: UserProfile): SaveProfileCompleted_Action {
  return {
    type: "SAVE_PROFILE__COMPLETED",
    profile
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function saveProfile(profile: UserProfile) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      updateMyProfile(token, profile).then(() => {
        dispatch(complete(profile));
      });
    });
  };
}
