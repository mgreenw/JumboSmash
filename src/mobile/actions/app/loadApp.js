// @flow
import type { Dispatch } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { User, UserSettings, UserProfile } from "mobile/reducers";
import getMyProfile from "mobile/api/users/GetMyProfile";
import getMySettings from "mobile/api/users/GetMySettings";

// Gets auth (token, utln) from async store, saves to redux state.
export const LOAD_APP__INITIATED = "LOAD_APP__INITIATED";
export const LOAD_APP__COMPLETED = "LOAD_APP__COMPLETED";
type LOAD_APP__INITIATED_TYPE = { type: string };
type LOAD_APP__COMPLETE_TYPE = { type: string, user: ?User };

function initiate(): LOAD_APP__INITIATED_TYPE {
  return {
    type: LOAD_APP__INITIATED
  };
}

function complete(
  profile: ?UserProfile,
  settings: ?UserSettings
): LOAD_APP__COMPLETE_TYPE {
  return {
    type: LOAD_APP__COMPLETED,
    user:
      profile && settings
        ? {
            profile: profile,
            settings: settings
          }
        : null
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
        getMySettings({
          token
        }).then(settings => {
          dispatch(complete(profile, settings));
        });
      });
    });
  };
}
