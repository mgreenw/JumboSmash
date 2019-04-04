// @flow

import type { Message } from 'mobile/reducers';
import apiRequest from '../utils/apiRequest';
import { READ_MESSAGE__ROUTE } from '../routes';

const READ_MESSAGE__SUCCESS = 'READ_MESSAGE__SUCCESS';

export default function sendMessage(
  userId: number,
  content: string,
  unconfirmedMessageUuid: string
): Promise<{ message: Message, previousMessageId: number }> {
  return apiRequest('POST', SEND_MESSAGE__ROUTE + userId, {
    content,
    unconfirmedMessageUuid
  }).then(response => {
    switch (response.status) {
      case SEND_MESSAGE__SUCCESS: {
        return response.data;
      }
      default:
        throw new Error(response);
    }
  });
}
