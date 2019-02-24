// @flow

import type { $Request } from 'express';

const slack = require('../../slack');
const { SEND_FEEDBACK__SUCCESS } = require('../status-codes');
const { asyncHandler, status, validate } = require('../utils');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "message": {
      "description": "The description of why the user was blocked.",
      "type": "string",
    }
  },
  "required": ["message"]
};
/* eslint-enable */

/**
 * @api {post} /api/meta/feedback
 *
 */
const sendFeedback = async (
  userId: number,
  message: string,
) => {
  // Post the message and return
  slack.postFeedback(userId, message);
  return status(SEND_FEEDBACK__SUCCESS).noData();
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return sendFeedback(
      req.user.id,
      req.body.message,
    );
  }),
];

module.exports = {
  handler,
  apply: sendFeedback,
};
