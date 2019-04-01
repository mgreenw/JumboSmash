// @flow

const logger = require('../../logger');
const Socket = require('../../socket');

const READ_RECEIPT_UPDATE = 'READ_RECEIPT_UPDATE';
module.exports = async (
  senderUserId: number,
  readerUserId: number,
  messageId: number,
  timestamp: string,
) => {
  logger.debug(`Sending read receipt update to user ${senderUserId}.`);
  // Send the notification over socket to the matched user
  return Socket.notify(senderUserId, READ_RECEIPT_UPDATE, {
    readReceipt: {
      messageId,
      timestamp,
    },
    readerUserId,
  });
};
