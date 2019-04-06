// @flow
import type { ProfileFields, UserSettings, Dispatch } from 'mobile/reducers';
import { createMyProfileFields } from 'mobile/api/users/updateMyProfile';
import updateMySettings from 'mobile/api/users/updateMySettings';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import Sentry from 'sentry-expo';
import DevTesting from '../../utils/DevTesting';

export type CreateUserInitiated_Action = {
  type: 'CREATE_PROFILE_AND_SETTINGS__INITIATED',
  payload: {},
  meta: {}
};
export type CreateUserCompleted_Action = {
  type: 'CREATE_PROFILE_AND_SETTINGS__COMPLETED',
  payload: {},
  meta: {}
};
export type CreateUserFailed_Action = {
  type: 'CREATE_PROFILE_AND_SETTINGS__FAILED',
  payload: {},
  meta: {}
};

function initiate(): CreateUserInitiated_Action {
  return {
    type: 'CREATE_PROFILE_AND_SETTINGS__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(): CreateUserCompleted_Action {
  return {
    type: 'CREATE_PROFILE_AND_SETTINGS__COMPLETED',
    payload: {},
    meta: {}
  };
}

// This failure case should only stop the inProgress state; all errors should be generic and caught by middleware.
function fail(): CreateUserFailed_Action {
  return {
    type: 'CREATE_PROFILE_AND_SETTINGS__FAILED',
    payload: {},
    meta: {}
  };
}

export default (fields: ProfileFields, settings: UserSettings) => (
  dispatch: Dispatch
) => {
  dispatch(initiate());
  DevTesting.fakeLatency(() => {
    // Important that they occur in this order; we use a created profile
    // to determine that onboarding is done, so settings must be created first
    updateMySettings(settings)
      .then(() => {
        createMyProfileFields(fields)
          .then(() => {
            Sentry.captureMessage('User Created!', {
              level: 'info'
            });
            dispatch(complete());
          })
          .catch(error => {
            dispatch(apiErrorHandler(error));
            dispatch(fail());
          });
      })
      .catch(error => {
        dispatch(apiErrorHandler(error));
        dispatch(fail());
      });
  });
};
