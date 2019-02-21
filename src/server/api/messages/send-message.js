// @flow

import type { $Request } from 'express';

const db = require('../../db');
const codes = require('../status-codes');
const apiUtils = require('../utils');
const { sendUpdateToUser } = require('../../socket');

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
 * @api {post} /api/messages/:userId
 *
 * NOTE: We currently do not make sure that users are matched. This is a performance and simplicity
 *       decision as we will not provide UI for users to message users they are not matched to.
 *       We may consider improving/changing this in the future.
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
        true AS "fromClient",
        null AS "previousMessageId"
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

    if (previousMessageResult.rowCount > 0) {
      message.previousMessageId = previousMessageResult.rows[0].id;
    }

    const messageForReceiver = {
      ...message,
      fromClient: false,
    };

    // Send the message over the socket!
    sendUpdateToUser(receiverUserId, {
      type: 'NEW_MESSAGE',
      data: messageForReceiver,
    });

    return apiUtils.status(codes.SEND_MESSAGE__SUCCESS).data(message);
  } catch (err) {
    // This checks that the error was not caused due to a duplicate message_uuid_key
    // This is not important from a design standpoint but will be catch bugs in testing
    if (err.code === '23505' && err.constraint === 'messages_unconfirmed_message_uuid_key') {
      return apiUtils.status(codes.SEND_MESSAGE__DUPLICATE_UNCONFIRMED_MESSAGE_UUID).noData();
    }
    // Check if the error was due to the fact that the other user does not
    // exist. If so, return a regular error
    if (err.code === '23503' && err.constraint === 'messages_receiver_user_id_fkey') {
      return apiUtils.status(codes.SEND_MESSAGE__USER_NOT_FOUND).noData();
    }

    throw err;
  }
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
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
