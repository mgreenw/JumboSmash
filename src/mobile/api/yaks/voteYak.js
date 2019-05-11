// @flow
import type { Yak } from 'mobile/api/serverTypes';
import apiRequest from '../utils/apiRequest';
import { VOTE_YAK__ROUTE__GENERATOR } from '../routes';

const VOTE_ON_YAK__SUCCESS = 'VOTE_ON_YAK__SUCCESS';

export default function voteYak(
  id: number,
  liked: boolean
): Promise<{ yak: Yak }> {
  return apiRequest('PATCH', VOTE_YAK__ROUTE__GENERATOR(id), { liked }).then(
    response => {
      switch (response.status) {
        case VOTE_ON_YAK__SUCCESS: {
          return response.data;
        }
        default:
          throw new Error(response);
      }
    }
  );
}
