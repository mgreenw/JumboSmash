// @flow
import _ from 'lodash';
import type { UserSettings, Dispatch, GetState } from 'mobile/reducers';
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

const saveSettings = (settings: UserSettings) => {
  function thunk(dispatch: Dispatch, getState: GetState) {
    const { client } = getState();
    if (client && _.isEqual(client.settings, settings)) {
      return;
    }
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
  }
  thunk.interceptInOffline = true;
  return thunk;
};

export default saveSettings;
