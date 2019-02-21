// @flow

type NEW_MESSAGE = {
  type: 'NEW_MESSAGE',
  data: {
    messageId: string,
    timestamp: string,
    content: string,
    unconfirmedMessageUuid: string,
    fromClient: boolean,
    previousMessageId: ?number,
  }
};

type Update = NEW_MESSAGE;

function sendUpdateToUser(userId: number, update: Update) {
  try {
    const runningIo = getIo();
    runningIo.to(userId.toString()).emit(update.type, update.data);
    logger.info(`Sent ${update.type} to userId ${userId} : ${JSON.stringify(update.data, null, 2)}`);
  } catch (error) {
    logger.warn('Failed to send update to user', error);
  }
}

module.exports = sendUpdateToUser;
