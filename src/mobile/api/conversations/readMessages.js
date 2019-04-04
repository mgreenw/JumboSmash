// @flow
import apiRequest from '../utils/apiRequest';
import { READ_MESSAGE__ROUTE__GENERATOR } from '../routes';

const SEND_MESSAGE__SUCCESS = 'SEND_MESSAGE__SUCCESS';

export default function sendMessage(
  matchId: number,
  messageId: number
): Promise<void> {
  const route = READ_MESSAGE__ROUTE__GENERATOR(matchId, messageId);
  // No body for this.
  return apiRequest('POST', route).then(response => {
    switch (response.status) {
      case SEND_MESSAGE__SUCCESS: {
        return response.data;
      }
      default:
        throw new Error(response);
    }
  });
}
