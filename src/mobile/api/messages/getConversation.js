// @flow

import type { Message } from 'mobile/reducers';
import apiRequest from '../utils/apiRequest';
import { GET_CONVERSATION } from '../routes';

const GET_CONVERSATION__SUCCESS = 'GET_CONVERSATION__SUCCESS';
const GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID =
  'GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID';

function getConversationUrl(userId: number, mostRecentMessageId?: number) {
  const queryParams = mostRecentMessageId
    ? `?most-recent-message-id=${mostRecentMessageId}`
    : '';
  return GET_CONVERSATION + userId + queryParams;
}

export default function getConversation(
  userId: number,
  mostRecentMessageId?: number
): Promise<Message[]> {
  const url = getConversationUrl(userId, mostRecentMessageId);
  return apiRequest('GET', url).then(response => {
    switch (response.status) {
      case GET_CONVERSATION__SUCCESS: {
        return response.data;
      }
      case GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID: {
        throw new Error('Error: Invalid most recent message ID');
      }
      default:
        throw new Error(response);
    }
  });
}
