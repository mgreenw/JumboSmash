// @flow

import type {
  SearchArtistsInitiated_Action,
  SearchArtistsCompleted_Action,
  SearchArtistsFailed_Action
} from 'mobile/actions/artists/searchArtists';
import type { Artist, ReduxState, inProgress } from './index';

//  A true slice reducer.
//  Everything needed to handle spotify lives purely in this file.

function updateInProgress(
  state: ReduxState,
  isInProgress: boolean
): inProgress {
  return {
    ...state.inProgress,
    search: isInProgress
  };
}

function initiate(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: SearchArtistsInitiated_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, true)
  };
}

function complete(
  state: ReduxState,
  action: SearchArtistsCompleted_Action
): ReduxState {
  const { artists }: { artists: Artist[] } = action.payload;
  const searchResultIds = artists.map((artist: Artist) => artist.id);
  const byId = artists.reduce(
    (map: { [id: string]: Artist }, artist: Artist) => ({
      ...map,
      [artist.id]: artist
    }),
    state.byId
  );
  return {
    ...state,
    inProgress: updateInProgress(state, false),
    searchResultIds,
    byId
  };
}

function fail(
  state: ReduxState,
  /* eslint-disable-next-line no-unused-vars */
  action: SearchArtistsFailed_Action
): ReduxState {
  return {
    ...state,
    inProgress: updateInProgress(state, false)
  };
}

export type SearchArtists_Action =
  | SearchArtistsInitiated_Action
  | SearchArtistsCompleted_Action
  | SearchArtistsFailed_Action;

export default { initiate, complete, fail };
