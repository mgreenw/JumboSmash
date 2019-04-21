// @flow
import type { Dispatch } from 'mobile/reducers';
import type { Artist } from 'mobile/reducers/artists';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import getArtist from 'mobile/api/artists/getArtist';

export type GetArtistInitiated_Action = {
  type: 'GET_ARTIST__INITIATED',
  payload: { id: string },
  meta: {}
};
export type GetArtistCompleted_Action = {
  type: 'GET_ARTIST__COMPLETED',
  payload: { artist: Artist, id: string },
  meta: {}
};
export type GetArtistFailed_Action = {
  type: 'GET_ARTIST__FAILED',
  payload: { id: string },
  meta: {}
};

function initiate(id: string): GetArtistInitiated_Action {
  return {
    type: 'GET_ARTIST__INITIATED',
    payload: { id },
    meta: {}
  };
}

function complete(artist: Artist, id: string): GetArtistCompleted_Action {
  return {
    type: 'GET_ARTIST__COMPLETED',
    payload: { artist, id },
    meta: {}
  };
}

function fail(id: string): GetArtistFailed_Action {
  return {
    type: 'GET_ARTIST__FAILED',
    payload: { id },
    meta: {}
  };
}

export default (id: string) => (dispatch: Dispatch) => {
  dispatch(initiate(id));
  getArtist(id)
    .then(({ artist }) => {
      dispatch(complete(artist, id));
    })
    .catch(error => {
      dispatch(fail(id));
      dispatch(apiErrorHandler(error));
    });
};
