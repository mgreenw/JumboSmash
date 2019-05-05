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
      "description": "The feedback.",
      "type": "string",
    },
    "reasonCode": {
      "description": "The standized reason string",
      "type": "string",
      "maxLength": 100
    }
  },
  "required": ["message", "reasonCode"]
};
/* eslint-enable */

/**
 * @api {post} /api/meta/feedback
 *
 */
const sendFeedback = async (
  userId: number,
  message: string,
  reasonCode: string,
) => {
  // Post the message and return
  await slack.postFeedback(userId, message, reasonCode);
  return status(SEND_FEEDBACK__SUCCESS).noData();
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return sendFeedback(
      req.user.id,
      req.body.message,
      req.body.reasonCode,
    );
  }),
];

module.exports = {
  handler,
  apply: sendFeedback,
};
