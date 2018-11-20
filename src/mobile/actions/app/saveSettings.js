// @flow
import type { Dispatch } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserSettings } from "mobile/reducers";
import { updateMySettings } from "mobile/api/users/updateMySettings";

// Gets auth (token, utln) from async store, saves to redux state.
export const UPDATE_MY_SETTINGS__INITIATED = "UPDATE_MY_SETTINGS__INITIATED";
export const UPDATE_MY_SETTINGS__COMPLETED = "UPDATE_MY_SETTINGS__COMPLETED";

function initiate() {
  console.log("initiate!");

  return {
    type: UPDATE_MY_SETTINGS__INITIATED
  };
}

function complete(settings: UserSettings) {
  console.log("complete!");
  return {
    type: UPDATE_MY_SETTINGS__COMPLETED,
    settings
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function saveSettings(token: string, settings: UserSettings) {
  console.log("saveSettings settings:", settings);
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      console.log("done faking latency");
      updateMySettings({
        token,
        settings
      }).then(() => {
        dispatch(complete(settings));
      });
    });
  };
}
