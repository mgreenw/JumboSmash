// @flow
import type { Dispatch } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { User, UserSettings, UserProfile } from "mobile/reducers";
import getMyProfile from "mobile/api/users/GetMyProfile";
import getMySettings from "mobile/api/users/GetMySettings";

export type LoadAppInitiated_Action = { type: "LOAD_APP__INITIATED" };
export type LoadAppCompleted_Action = {
  type: "LOAD_APP__COMPLETED",
  user: ?User
};

function initiate(): LoadAppInitiated_Action {
  return {
    type: "LOAD_APP__INITIATED"
  };
}

function complete(
  profile: ?UserProfile,
  settings: ?UserSettings
): LoadAppCompleted_Action {
  DevTesting.log("load app complete; profile && settigs: ", profile, settings);
  return {
    type: "LOAD_APP__COMPLETED",
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
  DevTesting.log("loading app with token: ", token);
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
