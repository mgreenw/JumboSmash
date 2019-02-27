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

const saveProfile = (fields: ProfileFields) => {
  function thunk(dispatch: Dispatch, getState: GetState) {
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
      });
  }
  thunk.interceptInOffline = true;
  return thunk;
};

export default saveProfile;
