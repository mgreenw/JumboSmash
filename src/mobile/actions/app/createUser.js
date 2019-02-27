// @flow
import type { ProfileFields, UserSettings, Dispatch } from 'mobile/reducers';
import { createMyProfileFields } from 'mobile/api/users/updateMyProfile';
import updateMySettings from 'mobile/api/users/updateMySettings';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

export type CreateProfileAndSettingsInitiated_Action = {
  type: 'CREATE_PROFILE_AND_SETTINGS__INITIATED',
  payload: {},
  meta: {}
};
export type CreateProfileAndSettingsCompleted_Action = {
  type: 'CREATE_PROFILE_AND_SETTINGS__COMPLETED',
  payload: {},
  meta: {}
};

function initiate(): CreateProfileAndSettingsInitiated_Action {
  return {
    type: 'CREATE_PROFILE_AND_SETTINGS__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(): CreateProfileAndSettingsCompleted_Action {
  return {
    type: 'CREATE_PROFILE_AND_SETTINGS__COMPLETED',
    payload: {},
    meta: {}
  };
}

const createUser = (fields: ProfileFields, settings: UserSettings) => {
  function thunk(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      // Important that they occur in this order; we use a created profile
      // to determine that onboarding is done, so settings must be created first
      updateMySettings(settings)
        .then(() => {
          createMyProfileFields(fields).then(() => {
            dispatch(complete());
          });
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  }
  thunk.interceptInOffline = true;
  return thunk;
};

export default createUser;
