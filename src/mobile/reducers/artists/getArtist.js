// @flow

import type {
  GetArtistInitiated_Action,
  GetArtistCompleted_Action,
  GetArtistFailed_Action
} from 'mobile/actions/artists/getArtist';
import type { ReduxState, inProgress } from './index';

//  A true slice reducer.
//  Everything needed to handle spotify lives purely in this file.

function updateInProgress(
  state: ReduxState,
  id: string,
  isInProgress: boolean
): inProgress {
  return {
    ...state.inProgress,
    getArtist: {
      ...state.inProgress.getArtist,
      [id]: isInProgress
    }
  };
}

function initiate(
  state: ReduxState,
  action: GetArtistInitiated_Action
): ReduxState {
  const { id } = action.payload;
  return {
    ...state,
    inProgress: updateInProgress(state, id, true)
  };
}

function complete(
  state: ReduxState,
  action: GetArtistCompleted_Action
): ReduxState {
  const { artist, id } = action.payload;
  const byId = {
    ...state.byId,
    [artist.id]: artist
  };
  return {
    ...state,
    inProgress: updateInProgress(state, id, false),
    byId
  };
}

/* eslint-disable-next-line no-unused-vars */
function fail(state: ReduxState, action: GetArtistFailed_Action): ReduxState {
  const { id } = action.payload;
  return {
    ...state,
    inProgress: updateInProgress(state, id, false)
  };
}

export type GetArtist_Action =
  | GetArtistInitiated_Action
  | GetArtistCompleted_Action
  | GetArtistFailed_Action;

export default { initiate, complete, fail };
