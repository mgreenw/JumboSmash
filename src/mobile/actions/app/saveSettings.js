// @flow
import _ from 'lodash';
import type { UserSettings, Dispatch, GetState, Scene } from 'mobile/reducers';
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
  meta: { disableToast: boolean }
};

export type SaveSettingsFailed_Action = {
  type: 'SAVE_SETTINGS__FAILED',
  payload: {},
  meta: { disableToast: boolean }
};

function initiate(): SaveSettingsInitiated_Action {
  return {
    type: 'SAVE_SETTINGS__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(
  settings: UserSettings,
  disableToast: boolean = false
): SaveSettingsCompleted_Action {
  return {
    type: 'SAVE_SETTINGS__COMPLETED',
    payload: settings,
    meta: {
      disableToast
    }
  };
}

function fail(disableToast: boolean = false): SaveSettingsFailed_Action {
  return {
    type: 'SAVE_SETTINGS__FAILED',
    payload: {},
    meta: {
      disableToast
    }
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

const enableScene = (scene: Scene) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { client } = getState();

  // Should always be called from inside app
  if (!client) {
    throw new Error('client null in enable scene');
  }
  const settings: UserSettings = {
    ...client.settings,
    activeScenes: {
      ...client.settings.activeScenes,
      [scene]: true
    }
  };
  dispatch(initiate());
  updateMySettings(settings)
    .then(newSettings => {
      dispatch(complete(newSettings, true));
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
      dispatch(fail(true));
    });
};

export { enableScene };
