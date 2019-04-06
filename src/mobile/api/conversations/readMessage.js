// @flow
import apiRequest from '../utils/apiRequest';
import { READ_MESSAGE__ROUTE__GENERATOR } from '../routes';

const READ_MESSAGE__SUCCESS = 'READ_MESSAGE__SUCCESS';
const ALREADY_READ_MESSAGE = 'ALREADY_READ_MESSAGE';

export default function readMEssage(
  matchId: number,
  messageId: number
): Promise<void> {
  const route = READ_MESSAGE__ROUTE__GENERATOR(matchId, messageId);
  // No body for this.
  return apiRequest('PATCH', route).then(response => {
    switch (response.status) {
      case READ_MESSAGE__SUCCESS: {
        return;
      }
      case ALREADY_READ_MESSAGE: {
        return;
      }
      default:
        throw new Error(response);
    }
  });
}
