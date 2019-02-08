// @flow
/* eslint-disable */

import type { Dispatch, GetState } from 'redux';
import type { UserSettings } from 'mobile/reducers';
import updateMySettings from 'mobile/api/users/updateMySettings';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

export type SaveSettingsInitiated_Action = {
  type: 'SAVE_SETTINGS__INITIATED',
  payload: {},
  meta: {},
};
export type SaveSettingsCompleted_Action = {
  type: 'SAVE_SETTINGS__COMPLETED',
  payload: {
    settings: UserSettings,
  },
  meta: {},
};

function initiate(): SaveSettingsInitiated_Action {
  return {
    type: 'SAVE_SETTINGS__INITIATED',
    payload: {},
    meta: {},
  };
}

function complete(settings: UserSettings): SaveSettingsCompleted_Action {
  return {
    type: 'SAVE_SETTINGS__COMPLETED',
    payload: { settings },
    meta: {},
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function saveSettings(token: string, settings: UserSettings) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      updateMySettings(token, settings)
        .then(() => {
          dispatch(complete(settings));
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  };
}
