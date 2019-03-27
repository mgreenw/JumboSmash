// @flow

const newMessageExpo = require('./expo');
const newMessageSocket = require('./socket');

export type Message = {
  id: number,
  timestamp: string,
  content: string,
  unconfirmedMessageUuid: string,
  fromClient: boolean,
};

function newMessage(
  senderUserId: number,
  receiverUserId: number,
  message: Message,
  previousMessageId: ?number,
) {
  // Ensure that the 'fromClient' is always false - you'd never get notified
  // about a message you didn't send!
  const updatedMessage: Message = {
    ...message,
    fromClient: false,
  };
  newMessageExpo(senderUserId, receiverUserId, updatedMessage);
  newMessageSocket(senderUserId, receiverUserId, updatedMessage, previousMessageId);
}

module.exports = newMessage;
