// @flow
import type { Dispatch } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserSettings, UserProfile } from "mobile/reducers";

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

export function loadApp(token: string) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      dispatch(complete(null, null));
    });
  };
}
