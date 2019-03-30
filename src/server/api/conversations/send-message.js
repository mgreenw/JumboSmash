// @flow

import type { $Request } from 'express';

const db = require('../../db');
const codes = require('../status-codes');
const {
  status,
  asyncHandler,
  validate,
  canAccessUserData,
} = require('../utils');
const Notifications = require('../../notifications');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "content": {
      "description": "The text to send!",
      "type": "string",
      "minLength": 1,
      "maxLength": 500,
    },
    "unconfirmedMessageUuid": {
      "description": "A client specific token.",
      "type": "string",
      "format": "uuid"
    }
  },
  "required": ["content", "unconfirmedMessageUuid"]
};
/* eslint-enable */

/**
 * @api {post} /api/conversations/:userId
 *
 */
const sendMessage = async (
  senderUserId: number,
  receiverUserId: number,
  content: string,
  unconfirmedMessageUuid: string,
) => {
  try {
    const messageResult = await db.query(`
      INSERT INTO messages
      (content, sender_user_id, receiver_user_id, unconfirmed_message_uuid)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id AS "messageId",
        timestamp,
        content,
        unconfirmed_message_uuid AS "unconfirmedMessageUuid",
        'client' AS sender
    `, [content, senderUserId, receiverUserId, unconfirmedMessageUuid]);

    const [message] = messageResult.rows;

    const previousMessageResult = await db.query(`
      SELECT id
      FROM messages
      WHERE timestamp < $3 AND (
        (sender_user_id = $1 AND receiver_user_id = $2)
        OR
        (sender_user_id = $2 AND receiver_user_id = $1)
      )
      ORDER BY timestamp desc
      LIMIT 1
    `, [senderUserId, receiverUserId, message.timestamp]);

    let previousMessageId = null;
    if (previousMessageResult.rowCount > 0) {
      previousMessageId = previousMessageResult.rows[0].id;
    }

    Notifications.newMessage(senderUserId, receiverUserId, message, previousMessageId);

    return status(codes.SEND_MESSAGE__SUCCESS).data({
      message,
      previousMessageId,
    });
  } catch (err) {
    // This checks that the error was not caused due to a duplicate message_uuid_key
    // This is not important from a design standpoint but will catch bugs in testing
    if (err.code === '23505' && err.constraint === 'messages_unconfirmed_message_uuid_key') {
      return status(codes.SEND_MESSAGE__DUPLICATE_UNCONFIRMED_MESSAGE_UUID).noData();
    }
    // Check if the error was due to the fact that the other user does not
    // exist. If so, return a regular error
    if (err.code === '23503' && err.constraint === 'messages_receiver_user_id_fkey') {
      return status(codes.SEND_MESSAGE__USER_NOT_FOUND).noData();
    }

    throw err;
  }
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    // Ensure the user can access the other user's data
    const canSendMessage = await canAccessUserData(req.params.userId, req.user.id, {
      requireMatch: true,
    });
    if (!canSendMessage) {
      return status(codes.SEND_MESSAGE__USER_NOT_FOUND).noData();
    }

    // If the user can send the message, go for it!
    return sendMessage(
      req.user.id,
      req.params.userId,
      req.body.content,
      req.body.unconfirmedMessageUuid,
    );
  }),
];

module.exports = {
  handler,
  apply: sendMessage,
};
