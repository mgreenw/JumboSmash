// @flow

const readReceiptUpdateSocket = require('./socket');

function readReceiptUpdate(
  senderUserId: number,
  readerUserId: number,
  messageId: number,
  timestamp: string,
) {
  readReceiptUpdateSocket(senderUserId, readerUserId, messageId, timestamp);
}

module.exports = readReceiptUpdate;
