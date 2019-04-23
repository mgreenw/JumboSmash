// @flow
import type { Artist } from 'mobile/reducers/artists';
import apiRequest from '../utils/apiRequest';
import { ARTIST_ROUTE } from '../routes';

const SEARCH_ARTISTS__SUCCESS = 'SEARCH_ARTISTS__SUCCESS';

export default function getArtist(
  search: string
): Promise<{ artists: Artist[] }> {
  return apiRequest('GET', `${ARTIST_ROUTE}?name=${search}`).then(response => {
    switch (response.status) {
      case SEARCH_ARTISTS__SUCCESS: {
        return response.data;
      }
      default:
        throw new Error(response);
    }
  });
}
