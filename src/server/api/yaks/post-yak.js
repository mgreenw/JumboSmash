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

const yakSelect = utils.yakSelect('$1', {
  yakTableAlias: 'yak',
  yakVotesTableAlias: 'vote',
  buildJSON: false,
});

const YAKS_PER_DAY = 3;

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
const postYak = async (senderUserId: number, content: string) => {
  // Check that there are only yaks per day
  const [{ yaksInLast24Hours, nextPostTimestamp }] = (await db.query(`
    SELECT
      count(id) AS "yaksInLast24Hours",
      MIN(timestamp) AS "nextPostTimestamp"
    FROM yaks
    WHERE
      user_id = $1
      AND timestamp > NOW() - INTERVAL '24 HOURS'
  `, [senderUserId])).rows;

  if (yaksInLast24Hours >= YAKS_PER_DAY) {
    return status(codes.POST_YAK__TOO_MANY_YAKS).data({
      nextPostTimestamp,
    });
  }

  // If this fails it should be a server error.
  const yak = (await db.query(`
    WITH yak AS (
      INSERT INTO yaks
      (user_id, content, timestamp, score)
      VALUES ($1, $2, NOW(), 1)
      RETURNING *
    ), vote AS (
      INSERT INTO yak_votes
      (user_id, yak_id, liked)
      VALUES ($1, (SELECT id FROM yak), true)
      RETURNING *
    )
    SELECT ${yakSelect}
    FROM yak
    LEFT JOIN vote ON vote.yak_id = yak.id
  `, [senderUserId, content])).rows[0];

  return status(codes.POST_YAK__SUCCESS).data({
    yak,
    remainingYaks: YAKS_PER_DAY - yaksInLast24Hours - 1,
  });
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return postYak(req.user.id, req.body.content);
  }),
];

module.exports = {
  handler,
  apply: postYak,
};
