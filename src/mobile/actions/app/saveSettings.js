// @flow
import type { Dispatch, GetState } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { UserSettings } from "mobile/reducers";
import updateMySettings from "mobile/api/users/updateMySettings";

export const SAVE_SETTINGS__INITIATED = "SAVE_SETTINGS__INITIATED";
export const SAVE_SETTINGS__COMPLETED = "SAVE_SETTINGS__COMPLETED";

function initiate() {
  return {
    type: SAVE_SETTINGS__INITIATED
  };
}

function complete(settings: UserSettings) {
  return {
    type: SAVE_SETTINGS__COMPLETED,
    settings
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function saveSettings(token: string, settings: UserSettings) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      updateMySettings(token, settings).then(() => {
        dispatch(complete(settings));
      });
    });
  };
}
