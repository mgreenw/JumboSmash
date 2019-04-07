// @flow

const Expo = require('../../expo');
const utils = require('./utils');

module.exports = (matchingUserId: number, matchedUserId: number, scene: string) => {
  // Construct the shared notification body
  const body = `You have a new match! ${utils.emojis[scene]}`;
  const notification = {
    body,
    sound: 'default',
    badge: 1, // TODO: make this dynamic with the number of unread notification
  };
  const notificationData = userId => ({
    type: 'NEW_MATCH',
    payload: {
      scene,
      userId,
    },
  });

  // Send the two notifications! This is together because we want to send these
  // off in one request. Otherwise, we would seperate this into one function
  // that would be called twice.
  Expo.sendNotifications([
    {
      ...notification,
      userId: matchingUserId,
      data: notificationData(matchedUserId),
    },
    {
      ...notification,
      userId: matchedUserId,
      data: notificationData(matchingUserId),
    },
  ]);
};
