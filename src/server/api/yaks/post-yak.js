// @flow

import type { $Request } from 'express';

const db = require('../../db');
const codes = require('../status-codes');
const {
  status,
  asyncHandler,
  validate,
} = require('../utils');
const utils = require('./utils');

const yakSelect = utils.yakSelect('$1');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "content": {
      "description": "The yak to send!",
      "type": "string",
      "minLength": 5,
      "maxLength": 300,
    },
  },
  "required": ["content"]
};
/* eslint-enable */

/**
 * @api {post} /api/yaks
 *
 */
const sendYak = async (senderUserId: number, content: string) => {
  // If this fails it should be a server error.
  const yak = (await db.query(`
    WITH yak AS (
      INSERT INTO yaks
      (user_id, content, timestamp, score)
      VALUES ($1, $2, NOW(), 1)
      RETURNING ${yakSelect}
    ), vote AS (
      INSERT INTO yak_votes
      (user_id, yak_id, liked)
      VALUES ($1, (SELECT id FROM yak), true)
    )
    SELECT * from yak
  `, [senderUserId, content])).rows[0];

  return status(codes.POST_YAK__SUCCESS).data({ yak });
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return sendYak(req.user.id, req.body.content);
  }),
];

module.exports = {
  handler,
  apply: sendYak,
};
