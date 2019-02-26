// @flow

const { Expo } = require('expo-server-sdk');
const _ = require('lodash');

const db = require('./db');
const logger = require('./logger');

const expo = new Expo();

type Notification = {
  userId: number,
  sound: 'default' | null,
  body: string,
  data?: Object,
};

// Note: You cannot send more than one notification per user using this method.
// This is bad practice in general! Try hitting it again if really needed.
async function sendNotifications(notifications: Notification[]) {
  // Make a map of all the notifications by userId
  const notificationMap = {};
  notifications.forEach((notification) => {
    const { userId, ...rest } = notification;
    notificationMap[userId] = rest;
  });

  // Get the push token for each user in question and map them to the correct
  // notification
  (await db.query(`
    SELECT expo_push_token AS "expoPushToken", id AS "userId"
    FROM users
    WHERE id = ANY($1)
  `, [Object.keys(notificationMap)])).rows.forEach((row) => {
    if (row.expoPushToken) {
      if (Expo.isExpoPushToken(row.expoPushToken)) {
        notificationMap[row.userId].to = row.expoPushToken;
      } else {
        logger.info(`Invalid expo push token for user ${row.userId}`);
        delete notificationMap[row.userId];

        // Note: no await here: this is a "fire and forget"
        db.query('UPDATE users SET expo_push_token = null WHERE id = $1', [row.userId]);
      }
    } else {
      logger.info(`No push token for user ${row.userId} - throwing away message.`);
      delete notificationMap[row.userId];
    }
  });

  // Ensure all the user ids are accounted for
  Object.keys(notificationMap).forEach((userId) => {
    if (!notificationMap[userId].to) {
      delete notificationMap[userId];
      logger.info(`User ${userId} not found. Not sending a notification`);
    }
  });

  const chunks = expo.chunkPushNotifications(Object.entries(notificationMap));
  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  for (const chunk of chunks) {
    try {
      const justNotifications = chunk.map(notificationWithUserId => notificationWithUserId[1]);
      const ticketChunk = await expo.sendPushNotificationsAsync(justNotifications);
      ticketChunk.forEach((ticket, index) => {
        chunk[index][1].ticketId = ticket.id;
      });

      const generateValueTemplate = (startIndex: number): string => {
        return `($${startIndex + 1}, $${startIndex + 2}, $${startIndex + 3})`;
      };

      const template = chunk.map((notificaiton, index) => generateValueTemplate(index * 3)).join(',');
      const params = chunk.map((notification) => {
        return [notification[0], notification[1].ticketId, notification[1].to];
      });

      // Sweet! These have been sent, add them to the database
      await db.query(`
        INSERT INTO notifications
        (user_id, ticket_id, expo_push_token)
        VALUES ${template}
      `, _.flatten(params));

      logger.info(`Successfully sent ${chunk.length} push notification${chunk.length > 1 ? 's' : ''}`);

      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
    } catch (error) {
      logger.error('Failed to send notifications', error);
      logger.error(chunk);
    }
  }
}

module.exports = {
  sendNotifications,
};
