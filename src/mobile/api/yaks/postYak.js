// @flow
import type { Yak } from 'mobile/api/serverTypes';
import apiRequest from '../utils/apiRequest';
import { POST_YAK__ROUTE } from '../routes';

const POST_YAK__SUCCESS = 'POST_YAK__SUCCESS';

export default function postYak(content: string): Promise<{ yak: Yak }> {
  return apiRequest('POST', POST_YAK__ROUTE, { content }).then(response => {
    switch (response.status) {
      case POST_YAK__SUCCESS: {
        return response.data;
      }
      default:
        throw new Error(response);
    }
  });
}
