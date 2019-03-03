// @flow

const sendNotifications = require('./send-notifications');

function sendMessageNotification(senderUserId: number, receiverUserId: number, content: string) {

}

function sendMatchNotifications(userId: number, matchUserId: number, scene: string) {

}

module.exports = {
  sendMessageNotification,
  sendMatchNotification,
};
