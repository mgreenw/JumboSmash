// @flow

import type { $Request, $Response } from 'express';

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
 */
const sendMessage = async (req: $Request, res: $Response) => {
  try {
    const result = await db.query(`
      INSERT INTO messages
      (content, sender_user_id, receiver_user_id)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        timestamp,
        content,
        sender_user_id AS "senderUserId",
        receiver_user_id AS "receiverUserId"
    `, [req.body.content, req.user.id, req.params.userId]);

    const [message] = result.rows;

    return res.status(201).json({
      status: codes.SEND_MESSAGE__SUCCESS,
      message,
    });
  } catch (error) {
    // Check if the error was due to the fact that the other user does not
    // exist. If so, return a regular error
    if (error.code === '23503' && error.constraint === 'messages_receiver_user_id_fkey') {
      return res.status(400).json({
        status: codes.SEND_MESSAGE__USER_NOT_FOUND,
      });
    }

    // Otherwise, return a server error
    return apiUtils.error.server(res, 'Not implemented');
  }
};

module.exports = [apiUtils.validate(schema), sendMessage];
