// @flow

import type {
  ReviewProfileInitiated_Action,
  ReviewProfileCompleted_Action,
  ReviewProfileFailed_Action
} from 'mobile/actions/admin/reviewProfile';
import type { ReduxState, InProgress } from '../index';

function updateInProgress(
  state: ReduxState,
  userId: number,
  isInProgress: boolean
): InProgress {
  return {
    ...state.inProgress,
    reviewProfile: {
      ...state.inProgress.reviewProfile,
      [userId]: isInProgress
    }
  };
}

function initiate(
  state: ReduxState,
  action: ReviewProfileInitiated_Action
): ReduxState {
  const { userId } = action.payload;
  const inProgress = updateInProgress(state, userId, true);
  return {
    ...state,
    inProgress
  };
}

function complete(
  state: ReduxState,
  action: ReviewProfileCompleted_Action
): ReduxState {
  const { userId, updatedClassmate } = action.payload;
  const inProgress = updateInProgress(state, userId, false);
  const classmatesById = {
    ...state.classmatesById,
    [userId]: updatedClassmate
  };
  return {
    ...state,
    inProgress,
    classmatesById
  };
}

function fail(
  state: ReduxState,
  action: ReviewProfileFailed_Action
): ReduxState {
  const { userId } = action.payload;
  const inProgress = updateInProgress(state, userId, false);
  return {
    ...state,
    inProgress
  };
}

export type ReviewProfile_Action =
  | ReviewProfileInitiated_Action
  | ReviewProfileCompleted_Action
  | ReviewProfileFailed_Action;

export default { initiate, complete, fail };
