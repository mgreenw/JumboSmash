// @flow
import _ from 'lodash';
import type { UserSettings, Dispatch, GetState } from 'mobile/reducers';
import updateMySettings from 'mobile/api/users/updateMySettings';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

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

export type SaveSettingsFailed_Action = {
  type: 'SAVE_SETTINGS__FAILED',
  payload: {},
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

function fail(): SaveSettingsFailed_Action {
  return {
    type: 'SAVE_SETTINGS__FAILED',
    payload: {},
    meta: {}
  };
}

// TODO: catch errors, e.g. the common network timeout.
export default (settings: UserSettings) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { client } = getState();
  if (client && _.isEqual(client.settings, settings)) {
    return;
  }
  dispatch(initiate());
  updateMySettings(settings)
    .then(newSettings => {
      dispatch(complete(newSettings));
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
      dispatch(fail());
    });
};
