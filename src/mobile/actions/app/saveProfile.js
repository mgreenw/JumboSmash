// @flow
import type { Dispatch } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserProfile } from "mobile/reducers";
import { updateMyProfile } from "mobile/api/users/updateMyProfile";

// Gets auth (token, utln) from async store, saves to redux state.
export const SAVE_PROFILE__INITIATED = "SAVE_PROFILE__INITIATED";
export const SAVE_PROFILE__COMPLETED = "SAVE_PROFILE__COMPLETED";

function initiate() {
  return {
    type: SAVE_PROFILE__INITIATED
  };
}

function complete(profile: UserProfile) {
  return {
    type: SAVE_PROFILE__COMPLETED,
    profile
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function saveProfile(token: string, profile: UserProfile) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      updateMyProfile(token, profile).then(() => {
        dispatch(complete(profile));
      });
    });
  };
}
