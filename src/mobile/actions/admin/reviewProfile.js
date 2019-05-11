// @flow

import { Alert } from 'react-native';
import type { Dispatch, GetState } from 'mobile/reducers';
import type { ServerClassmate, Capabilities } from 'mobile/api/serverTypes';
import reviewProfileApi from 'mobile/api/admin/reviewProfile';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type ReviewProfileInitiated_Action = {
  type: 'REVIEW_PROFILE__INITIATED',
  payload: {|
    userId: number
  |},
  meta: {}
};

export type ReviewProfileCompleted_Action = {
  type: 'REVIEW_PROFILE__COMPLETED',
  payload: {|
    userId: number,
    updatedClassmate: ServerClassmate
  |},
  meta: {}
};

export type ReviewProfileFailed_Action = {
  type: 'REVIEW_PROFILE__FAILED',
  payload: {|
    userId: number
  |},
  meta: {}
};

function initiate(userId: number): ReviewProfileInitiated_Action {
  return {
    type: 'REVIEW_PROFILE__INITIATED',
    payload: {
      userId
    },
    meta: {}
  };
}

function complete(
  userId: number,
  updatedClassmate: ServerClassmate
): ReviewProfileCompleted_Action {
  return {
    type: 'REVIEW_PROFILE__COMPLETED',
    payload: {
      userId,
      updatedClassmate
    },
    meta: {}
  };
}

function fail(userId: number): ReviewProfileFailed_Action {
  return {
    type: 'REVIEW_PROFILE__FAILED',
    payload: { userId },
    meta: {}
  };
}

export default (
  password: string,
  userId: number,
  updatedCapabilities: Capabilities,
  comment: ?string
) => (dispatch: Dispatch, getState: GetState) => {
  if (
    (!updatedCapabilities.canBeActiveInScenes ||
      !updatedCapabilities.canBeSwipedOn) &&
    (!comment || comment.length < 5)
  ) {
    Alert.alert('Your comment must be at least 5 characters');
    return;
  }

  // This is to ensure that we don't override someone elses' updates to a profile,
  // by adding what the client 'thinks' the current classmate's capabilities are.
  // If there is a mismatch (someone else has reviewed in this time) then the update fails.

  // At the moment this will just be a 'server error' failure --
  // if this happens often we can provide better handling.
  const { classmatesById } = getState();
  const { capabilities: previousCapabilities } = classmatesById[userId];

  dispatch(initiate(userId));
  reviewProfileApi(password, userId, {
    updatedCapabilities,
    previousCapabilities,
    comment
  })
    .then(updatedClassmate => {
      dispatch(complete(userId, updatedClassmate));
    })
    .catch(error => {
      dispatch(fail(userId));
      dispatch(apiErrorHandler(error));
    });
};
