// @flow
/* eslint-disable */

import type { Dispatch } from 'mobile/reducers';
import type { ProfileFields } from 'mobile/reducers';
import { updateMyProfileFields } from 'mobile/api/users/updateMyProfile';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

export type SaveProfileFieldsInitiated_Action = {
  type: 'SAVE_PROFILE__INITIATED',
  payload: {},
  meta: {}
};
export type SaveProfileFieldsCompleted_Action = {
  type: 'SAVE_PROFILE__COMPLETED',
  payload: {
    fields: ProfileFields
  },
  meta: {}
};

function initiate(): SaveProfileFieldsInitiated_Action {
  return {
    type: 'SAVE_PROFILE__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(fields: ProfileFields): SaveProfileFieldsCompleted_Action {
  return {
    type: 'SAVE_PROFILE__COMPLETED',
    payload: {
      fields
    },
    meta: {}
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function saveProfileFieldsAction(fields: ProfileFields) {
  return function(dispatch: Dispatch, getState: GetState) {
    const { token } = getState();
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      updateMyProfileFields(token, fields)
        .then(newFields => {
          dispatch(complete(newFields));
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  };
}
