// @flow
import type { Dispatch } from 'mobile/reducers';
import type { Artist } from 'mobile/reducers/artists';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import searchArtists from 'mobile/api/artists/searchArtists';

export type SearchArtistsInitiated_Action = {
  type: 'SEARCH_ARTISTS__INITIATED',
  payload: {},
  meta: {}
};
export type SearchArtistsCompleted_Action = {
  type: 'SEARCH_ARTISTS__COMPLETED',
  payload: { artists: Artist[] },
  meta: {}
};
export type SearchArtistsFailed_Action = {
  type: 'SEARCH_ARTISTS__FAILED',
  payload: {},
  meta: {}
};

function initiate(): SearchArtistsInitiated_Action {
  return {
    type: 'SEARCH_ARTISTS__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(artists: Artist[]): SearchArtistsCompleted_Action {
  return {
    type: 'SEARCH_ARTISTS__COMPLETED',
    payload: { artists },
    meta: {}
  };
}

function fail(): SearchArtistsFailed_Action {
  return {
    type: 'SEARCH_ARTISTS__FAILED',
    payload: {},
    meta: {}
  };
}

export default (search: string) => (dispatch: Dispatch) => {
  dispatch(initiate());
  searchArtists(search)
    .then(({ artists }) => {
      dispatch(complete(artists));
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
