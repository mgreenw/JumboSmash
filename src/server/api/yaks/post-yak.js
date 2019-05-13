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

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "content": {
      "description": "The yak to send!",
      "type": "string",
      "minLength": 1,
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
  // Ensure the content is not empty
  if (content.trim().length === 0) {
    return status(codes.BAD_REQUEST).data({
      message: 'Content must have content.',
    });
  }

  // Check that there are only yaks per day
  const yaksInPast24Hours = (await db.query(`
    SELECT timestamp
    FROM yaks
    WHERE
      user_id = $1
      AND timestamp > NOW() - INTERVAL '65 MINUTES'
    ORDER BY timestamp
  `, [senderUserId])).rows;

  // Generate yak post availibility. If they cannot post, don't allow it.
  const yakPostAvailability = utils.getYakPostAvailability(yaksInPast24Hours);
  if (yakPostAvailability.yaksRemaining <= 0) {
    return status(codes.POST_YAK__TOO_MANY_YAKS).data({
      yakPostAvailability,
    });
  }

  // If this fails it should be a server error.
  const [yak] = (await db.query(`
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
    LEFT JOIN vote
      ON vote.yak_id = yak.id
      AND vote.user_id = $1
  `, [senderUserId, content])).rows;

  const updatedYakPostAvailability = utils.getYakPostAvailability([...yaksInPast24Hours, yak]);

  return status(codes.POST_YAK__SUCCESS).data({
    yakPostAvailability: updatedYakPostAvailability,
    yak,
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
