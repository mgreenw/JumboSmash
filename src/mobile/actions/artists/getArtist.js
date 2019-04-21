// @flow
import type { Dispatch } from 'mobile/reducers';
import type { Artist } from 'mobile/reducers/artists';
import getArtist from 'mobile/api/artists/getArtist';
import Sentry from 'sentry-expo';

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
      // This should fail in the background only because of how often we fire these requests.
      Sentry.captureException(new Error(JSON.stringify(error)));
    });
};
