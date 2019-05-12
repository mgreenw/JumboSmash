// @flow
import type { Dispatch } from 'mobile/reducers';
import type { Yak } from 'mobile/api/serverTypes';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import postYak, { TooManyYaksError } from 'mobile/api/yaks/postYak';

export type PostYakInitiated_Action = {
  type: 'POST_YAK__INITIATED',
  payload: {},
  meta: {}
};
export type PostYakCompleted_Action = {
  type: 'POST_YAK__COMPLETED',
  payload: { yak: Yak },
  meta: {}
};
export type PostYakFailed_Action = {
  type: 'POST_YAK__FAILED',
  payload: {},
  meta: {}
};
export type PostYakFailed_TOO_MANY_POSTS_action = {
  type: 'POST_YAK__FAILED_TOO_MANY',
  payload: {
    nextTimeStamp: string
  },
  meta: {}
};

function initiate(): PostYakInitiated_Action {
  return {
    type: 'POST_YAK__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(yak: Yak): PostYakCompleted_Action {
  return {
    type: 'POST_YAK__COMPLETED',
    payload: { yak },
    meta: {}
  };
}

function fail(): PostYakFailed_Action {
  return {
    type: 'POST_YAK__FAILED',
    payload: {},
    meta: {}
  };
}

function fail_tooMany(
  nextTimeStamp: string
): PostYakFailed_TOO_MANY_POSTS_action {
  return {
    type: 'POST_YAK__FAILED_TOO_MANY',
    payload: { nextTimeStamp },
    meta: {}
  };
}

export default (content: string) => (dispatch: Dispatch) => {
  dispatch(initiate());
  postYak(content)
    .then(({ yak }) => {
      dispatch(complete(yak));
    })
    .catch(error => {
      if (error instanceof TooManyYaksError) {
        dispatch(fail_tooMany(error.nextTimeStamp));
      } else {
        dispatch(fail());
        dispatch(apiErrorHandler(error));
      }
    });
};
