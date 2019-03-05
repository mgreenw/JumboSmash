// @flow

const Expo = require('../../expo');

const emojis = {
  smash: String.fromCodePoint(0x1F351),
  social: String.fromCodePoint(0x1F418),
  stone: String.fromCodePoint(0x1F343),
};

module.exports = (matchingUserId: number, matchedUserId: number, scene: string) => {
  // Construct the shared notification body
  const body = `You have a new match! ${emojis[scene]}`;
  const notification = {
    body,
    sound: 'default',
    badge: 1, // TODO: make this dynamic with the number of unread notification
  };
  const data = { scene };

  // Send the two notifications! This is together because we want to send these
  // off in one request. Otherwise, we would seperate this into one function
  // that would be called twice.
  Expo.sendNotifications([
    {
      ...notification,
      userId: matchingUserId,
      data: {
        ...data,
        userId: matchedUserId,
      },
    },
    {
      ...notification,
      userId: matchedUserId,
      data: {
        ...data,
        userId: matchingUserId,
      },
    },
  ]);
};
