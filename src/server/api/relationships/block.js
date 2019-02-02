// @flow

import type { $Request } from 'express';

const apiUtils = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "blockedUserId": {
      "description": "The id of the user to block",
      "type": "number",
      "multipleOf": 1 // This asserts that the javascript number is an integer
    }
  },
  "required": ["blockedUserId"]
};
/* eslint-enable */

/**
 * @api {post} /api/relationships/block
 *
 */
const block = async (userId: number, blockedUserId: number) => {
  // NOTES:
  // 1) This query will fail if the user does not exist. We handle
  //    this specific error in the "catch" block
  // 2) If there is currently no relationship between the two users, a
  //    relationship will be inserted. If there is a relationship, the
  //    relationship will be updated with the desired values
  // 3) The 'last_swipe_timestamp' is always updated to reflect that the
  //    critic has interacted with the candidate
  try {
    await db.query(`
      INSERT INTO relationships
        (critic_user_id, candidate_user_id, blocked)
        VALUES ($1, $2, true)
      ON CONFLICT (critic_user_id, candidate_user_id)
      DO UPDATE
        SET
        blocked = true,
        last_swipe_timestamp = now()
    `, [userId, blockedUserId]);

    // If the query succeeded, return success
    return apiUtils.status(codes.BLOCK__SUCCESS).data({});
  } catch (err) {
    // If the query failed due to a voilation of the candidate_user_id fkey
    // into the profiles table, return a more specific error. See here:
    // https://www.postgresql.org/docs/10/errcodes-appendix.html
    if (err.code === '23503' && err.constraint === 'relationships_candidate_user_id_fkey') {
      return apiUtils.status(codes.BLOCK__USER_NOT_FOUND).data({});
    }

    throw err;
  }
};

module.exports = [apiUtils.validate(schema), block];

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return block(req.user.id, req.body.blockedUserId);
  }),
];

module.exports = {
  handler,
  apply: block,
};
