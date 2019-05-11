// @flow

import type {
  VoteYakInitiated_Action,
  VoteYakCompleted_Action,
  VoteYakFailed_Action
} from 'mobile/actions/yaks/voteYak';
import type { ReduxState, inProgress } from './index';

function updateInProgress(
  state: ReduxState,
  id: number,
  isInProgress: boolean
): inProgress {
  return {
    ...state.inProgress,
    vote: { ...state.inProgress.vote, [id]: isInProgress }
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: VoteYakInitiated_Action
): ReduxState {
  const { id } = action.payload;
  return {
    ...state,
    inProgress: updateInProgress(state, id, true)
  };
}

/**
 *
 * Just updates the map to reflect the new yak.
 */
function complete(
  state: ReduxState,
  action: VoteYakCompleted_Action
): ReduxState {
  const { id, yak } = action.payload;
  return {
    ...state,
    inProgress: updateInProgress(state, id, false),
    byId: {
      ...state.byId,
      [id]: yak
    }
  };
}

function fail(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: VoteYakFailed_Action
): ReduxState {
  const { id } = action.payload;
  return {
    ...state,
    inProgress: updateInProgress(state, id, false)
  };
}

export type VoteYak_Action =
  | VoteYakInitiated_Action
  | VoteYakCompleted_Action
  | VoteYakFailed_Action;

export default { initiate, complete, fail };
