// @flow
import type { Dispatch } from 'mobile/reducers';
import getProfile from 'mobile/api/users/getProfile';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import type { ServerProfile } from 'mobile/api/serverTypes';

export type GetProfileInitiated_Action = {
  type: 'GET_PROFILE__INITIATED',
  payload: {
    userId: number
  },
  meta: {}
};
export type GetProfileCompleted_Action = {
  type: 'GET_PROFILE__COMPLETED',
  payload: {
    userId: number,
    profile: ServerProfile
  },
  meta: {}
};

export type GetProfileFailed_Action = {
  type: 'GET_PROFILE__FAILED',
  payload: {
    userId: number
  },
  meta: {}
};

function initiate(userId: number): GetProfileInitiated_Action {
  return {
    type: 'GET_PROFILE__INITIATED',
    payload: {
      userId
    },
    meta: {}
  };
}

function complete(
  userId: number,
  profile: ServerProfile
): GetProfileCompleted_Action {
  return {
    type: 'GET_PROFILE__COMPLETED',
    payload: {
      userId,
      profile
    },
    meta: {}
  };
}

function fail(userId: number): GetProfileFailed_Action {
  return {
    type: 'GET_PROFILE__FAILED',
    payload: {
      userId
    },
    meta: {}
  };
}

export default (userId: number) => (dispatch: Dispatch) => {
  dispatch(initiate(userId));
  getProfile(userId)
    .then(profile => {
      dispatch(complete(userId, profile));
    })
    .catch(error => {
      console.log(error);
      dispatch(apiErrorHandler(error));
      dispatch(fail(userId));
    });
};
