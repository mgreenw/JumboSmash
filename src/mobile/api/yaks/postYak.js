// @flow
import type { Yak } from 'mobile/api/serverTypes';
import apiRequest from '../utils/apiRequest';
import { POST_YAK__ROUTE } from '../routes';

const POST_YAK__SUCCESS = 'POST_YAK__SUCCESS';
export const POST_YAK__TOO_MANY_YAKS = 'POST_YAK__TOO_MANY_YAKS';

export class TooManyYaksError extends Error {
  nextTimeStamp: string;

  constructor(nextTimeStamp: string) {
    super(POST_YAK__TOO_MANY_YAKS);
    this.nextTimeStamp = nextTimeStamp;
  }
}

export default function postYak(content: string): Promise<{ yak: Yak }> {
  return apiRequest('POST', POST_YAK__ROUTE, { content }).then(response => {
    switch (response.status) {
      case POST_YAK__SUCCESS: {
        return response.data;
      }
      case POST_YAK__TOO_MANY_YAKS: {
        const { yakPostAvailability } = response.data;
        if (yakPostAvailability && yakPostAvailability.nextPostTimestamp) {
          throw new TooManyYaksError(yakPostAvailability.nextPostTimestamp);
        }
        throw new Error(response);
      }
      default:
        throw new Error(response);
    }
  });
}
