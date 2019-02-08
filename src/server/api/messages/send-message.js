// @flow

import type { $Request } from 'express';

const db = require('../../db');
const codes = require('../status-codes');
const apiUtils = require('../utils');

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
  },
  "required": ["content"]
};
/* eslint-enable */

/**
 * @api {post} /api/messages/:userId
 *
 * NOTE: We currently do not make sure that users are matched. This is a performance and simplicity
 *       decision as we will not provide UI for users to message users they are not matched to.
 *       We may consider improving/changing this in the future.
 */
const sendMessage = async (senderUserId: number, receieverUserId: number, content: string) => {
  try {
    const result = await db.query(`
      INSERT INTO messages
      (content, sender_user_id, receiver_user_id)
      VALUES ($1, $2, $3)
      RETURNING
        id AS "messageId",
        timestamp,
        content,
        true AS "fromClient"
    `, [content, senderUserId, receieverUserId]);

    const [message] = result.rows;

    return apiUtils.status(codes.SEND_MESSAGE__SUCCESS).data(message);
  } catch (err) {
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
    return sendMessage(req.user.id, req.params.userId, req.body.content);
  }),
];

module.exports = {
  handler,
  apply: sendMessage,
};
