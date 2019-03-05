// @flow

import type { Message } from './index';

const { apply: getProfile } = require('../../api/users/get-profile');
const codes = require('../../api/status-codes');

const Socket = require('../../socket');

const NEW_MESSAGE = 'NEW_MESSAGE';

module.exports = async (
  senderUserId: number,
  receiverUserId: number,
  message: Message,
  previousMessageId: ?number,
) => {
  // The sender's profile is being fetched here so an error here will not let the message
  // go through.
  const senderProfileResult = await getProfile(senderUserId);
  if (
    senderProfileResult.body.status !== codes.GET_PROFILE__SUCCESS.status
    || !senderProfileResult.body.data
  ) {
    throw new Error('Failed to get sender profile - this should have been caught by canAccessUserData()');
  }

  const senderProfile = senderProfileResult.body.data;

  // Send the message over the socket!
  Socket.notify(receiverUserId, NEW_MESSAGE, {
    message,
    senderUserId,
    senderProfile,
    previousMessageId,
  });
};
