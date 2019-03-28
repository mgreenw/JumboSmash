// @flow

import type { Message } from './index';

const Expo = require('../../expo');
const db = require('../../db');

module.exports = async (senderUserId: number, receiverUserId: number, message: Message) => {
  const [{ displayName }] = (await db.query(`
    SELECT display_name AS "displayName"
    FROM profiles
    WHERE user_id = $1
  `, [senderUserId])).rows;

  Expo.sendNotifications([{
    userId: receiverUserId,
    sound: 'default',
    body: `${displayName}: ${message.content}`,
    data: {
      type: 'NEW_MESSAGE',
      payload: {
        senderUserId,
      },
    },
    badge: 1, // TODO: make this dynamic with the number of unread messages
  }]);
};
