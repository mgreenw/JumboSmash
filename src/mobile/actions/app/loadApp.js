// @flow
import type { Dispatch } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserSettings, UserProfile } from "mobile/reducers";
import getMyProfile from "mobile/api/users/GetMyProfile";

// Gets auth (token, utln) from async store, saves to redux state.
export const LOAD_APP__INITIATED = "LOAD_APP__INITIATED";
export const LOAD_APP__COMPLETED = "LOAD_APP__COMPLETED";

function initiate() {
  return {
    type: LOAD_APP__INITIATED
  };
}

function complete(profile: ?UserProfile, settings: ?UserSettings) {
  return {
    type: LOAD_APP__COMPLETED,
    profile,
    settings
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function loadApp(token: string) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      getMyProfile({
        token
      }).then(profile => {
        dispatch(complete(profile, null));
      });
    });
  };
}
