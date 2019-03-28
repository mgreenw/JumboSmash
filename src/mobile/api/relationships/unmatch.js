// @flow

import apiRequest from '../utils/apiRequest';
import { UNMATCH__ROUTE } from '../routes';

const UNMATCH__SUCCESS = 'UNMATCH__SUCCESS';
const UNMATCH__NOT_MATCHED = 'UNMATCH__NOT_MATCHED';
export default function unmatch(matchId: number): Promise<void> {
  return apiRequest('POST', UNMATCH__ROUTE + matchId).then(response => {
    switch (response.status) {
      case UNMATCH__SUCCESS:
        return;
      case UNMATCH__NOT_MATCHED:
        // TODO: log this also!
        // we treat this as a success
        return;
      default:
        throw new Error(response);
    }
  });
}
