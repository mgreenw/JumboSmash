// @flow

import type { UserSettings, Dispatch } from 'mobile/reducers';
import updateMySettings from 'mobile/api/users/updateMySettings';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

export type SaveSettingsInitiated_Action = {
  type: 'SAVE_SETTINGS__INITIATED',
  payload: {},
  meta: {}
};
export type SaveSettingsCompleted_Action = {
  type: 'SAVE_SETTINGS__COMPLETED',
  payload: UserSettings,
  meta: {}
};

function initiate(): SaveSettingsInitiated_Action {
  return {
    type: 'SAVE_SETTINGS__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(settings: UserSettings): SaveSettingsCompleted_Action {
  return {
    type: 'SAVE_SETTINGS__COMPLETED',
    payload: settings,
    meta: {}
  };
}

// TODO: catch errors, e.g. the common network timeout.
export default (settings: UserSettings) => (dispatch: Dispatch) => {
  dispatch(initiate());
  DevTesting.fakeLatency(() => {
    updateMySettings(settings)
      .then(newSettings => {
        dispatch(complete(newSettings));
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
      });
  });
};
