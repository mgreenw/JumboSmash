// @flow

import type {
  PostYakInitiated_Action,
  PostYakCompleted_Action,
  PostYakFailed_Action,
  PostYakFailed_TOO_MANY_POSTS_action
} from 'mobile/actions/yaks/postYak';
import type { ReduxState, inProgress } from './index';

function updateInProgress(
  state: ReduxState,
  isInProgress: boolean
): inProgress {
  return {
    ...state.inProgress,
    post: isInProgress
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: PostYakInitiated_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, true),
    nextPostTimestamp: null
  };
}

/**
 *
 * Just updates the map to reflect the new yak.
 */
function complete(
  state: ReduxState,
  action: PostYakCompleted_Action
): ReduxState {
  const { yak } = action.payload;
  const { id } = yak;
  return {
    ...state,
    inProgress: updateInProgress(state, false),
    byId: {
      ...state.byId,
      [id]: yak
    },
    clientYakIds: [...state.clientYakIds, id],
    currentYakIds: [...state.currentYakIds, id]
  };
}

function fail_TOO_MANY_POSTS(
  state: ReduxState,
  action: PostYakFailed_TOO_MANY_POSTS_action
) {
  const { nextTimeStamp } = action.payload;
  return {
    ...state,
    inProgress: updateInProgress(state, false),
    nextPostTimestamp: nextTimeStamp
  };
}

function fail(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: PostYakFailed_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, false)
  };
}

export type PostYak_Action =
  | PostYakInitiated_Action
  | PostYakCompleted_Action
  | PostYakFailed_Action
  | PostYakFailed_TOO_MANY_POSTS_action;

export default { initiate, complete, fail, fail_TOO_MANY_POSTS };
