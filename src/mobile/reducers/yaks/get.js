// @flow

import type {
  GetYaksInitiated_Action,
  GetYaksCompleted_Action,
  GetYaksFailed_Action
} from 'mobile/actions/yaks/getYaks';
import type { Yak } from 'mobile/api/serverTypes';
import type { ReduxState, inProgress } from './index';

//  A true slice reducer.
//  Everything needed to handle JumboYaks lives purely in this file.

function updateInProgress(
  state: ReduxState,
  isInProgress: boolean
): inProgress {
  return {
    ...state.inProgress,
    get: isInProgress
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: GetYaksInitiated_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, true)
  };
}

function complete(
  state: ReduxState,
  action: GetYaksCompleted_Action
): ReduxState {
  const { yaks }: { yaks: Yak[] } = action.payload;
  const currentYakIds = yaks.map((yak: Yak) => yak.id);
  const byId = yaks.reduce(
    (map: { [id: number]: Yak }, yak: Yak) => ({
      ...map,
      [yak.id]: yak
    }),
    state.byId
  );
  return {
    ...state,
    inProgress: updateInProgress(state, false),
    currentYakIds,
    byId
  };
}

function fail(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: GetYaksFailed_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, false)
  };
}

export type GetYaks_Action =
  | GetYaksInitiated_Action
  | GetYaksCompleted_Action
  | GetYaksFailed_Action;

export default { initiate, complete, fail };
