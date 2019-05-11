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
    "liked": {
      "description": "If the user liked the yak or not",
      "type": "boolean",
    },
  },
  "required": ["liked"]
};
/* eslint-enable */

/**
 * @api {patch} /api/yaks/:id
 *
 */
const voteOnYak = async (voterUserId: number, yakId: number, liked: boolean) => {
  try {
    // First update the score (increment or decrement accordingly to liked)
    // Next add the vote to yak_votes
    // Finally, return the yak
    const yak = (await db.query(`
      WITH yak AS (
        UPDATE yaks
        SET score = score + CASE WHEN $3 THEN 1 ELSE 0 END
        WHERE id = $2
        RETURNING ${yakSelect}
      ),
      yak_vote AS (
        INSERT INTO yak_votes
        (user_id, yak_id, liked, updated_timestamp)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, yak_id) DO UPDATE
        SET liked = $3, updated_timestamp = NOW()
      )
      SELECT * from yak
    `, [voterUserId, yakId, liked])).rows[0];
    return status(codes.VOTE_ON_YAK__SUCCESS).data({ yak });
  } catch (error) {
    if (error.code === '23503' && error.constraint === 'yak_votes_yak_id_fkey') {
      return status(codes.VOTE_ON_YAK__YAK_NOT_FOUND).noData();
    }
    throw error;
  }
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return voteOnYak(req.user.id, req.params.yakId, req.body.liked);
  }),
];

module.exports = {
  handler,
  apply: voteOnYak,
};
