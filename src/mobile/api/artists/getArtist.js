// @flow
import type { Artist } from 'mobile/reducers/artists';
import apiRequest from '../utils/apiRequest';
import { ARTIST_ROUTE } from '../routes';

const GET_ARTIST__SUCCESS = 'GET_ARTIST__SUCCESS';

export default function getArtist(id: string): Promise<{ artist: Artist }> {
  return apiRequest('GET', `${ARTIST_ROUTE}:${id}`).then(response => {
    switch (response.status) {
      case GET_ARTIST__SUCCESS: {
        return response.data;
      }
      default:
        throw new Error(response);
    }
  });
}
