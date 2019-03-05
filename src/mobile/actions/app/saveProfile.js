// @flow
import _ from 'lodash';
import type { ProfileFields, Dispatch, GetState } from 'mobile/reducers';
import { updateMyProfileFields } from 'mobile/api/users/updateMyProfile';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

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

export type SaveProfileFieldsFailed_Action = {
  type: 'SAVE_PROFILE__FAILED',
  payload: {},
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

function fail(): SaveProfileFieldsFailed_Action {
  return {
    type: 'SAVE_PROFILE__FAILED',
    payload: {},
    meta: {}
  };
}

export default (fields: ProfileFields) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { client } = getState();
  if (client && _.isEqual(client.profile.fields, fields)) {
    return;
  }
  dispatch(initiate());
  updateMyProfileFields(fields)
    .then(newFields => {
      dispatch(complete(newFields));
    })
    .catch(error => {
      dispatch(apiErrorHandler(error));
      dispatch(fail());
    });
};
