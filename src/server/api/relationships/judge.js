// @flow

import type { $Request } from 'express';

const apiUtils = require('../utils');
const utils = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "candidateUserId": {
      "type": "number",
      "multipleOf": 1 // This asserts that the javascript number is an integer
    },
    "scene": {
      "type": "string",
      "enum": utils.scenes,
    },
    "liked": {
      "type": "boolean"
    }
  },
  "required": ["candidateUserId", "scene", "liked"]
};
/* eslint-enable */

/**
 * @api {post} /api/relationships/judge
 *
 */
const judge = async (userId: number, scene: string, candidateUserId: number, liked: boolean) => {
  // NOTES:
  // 1) This query will fail if the candidate does not have a profile. We handle
  //    this specific error in the "catch" block
  // 2) If there is currently no relationship between the two users, a
  //    relationship will be inserted. If there is a relationship, the
  //    relationship will be updated with the desired values
  // 3) The 'last_swipe_timestamp' is always updated to reflect that the
  //    critic has interacted with the candidate
  try {
    await db.query(`
      INSERT INTO relationships
        (critic_user_id, candidate_user_id, liked_${scene})
        VALUES ($1, $2, $3)
      ON CONFLICT (critic_user_id, candidate_user_id)
      DO UPDATE
        SET
        liked_${scene} = $3,
        last_swipe_timestamp = now()
    `, [userId, candidateUserId, liked]);

    // If the query succeeded, return success
    return apiUtils.status(codes.JUDGE__SUCCESS).noData();
  } catch (err) {
    // If the query failed due to a voilation of the candidate_user_id fkey
    // into the profiles table, return a more specific error. See here:
    // https://www.postgresql.org/docs/10/errcodes-appendix.html
    if (err.code === '23503' && err.constraint === 'relationships_candidate_user_id_fkey') {
      return apiUtils.status(codes.JUDGE__CANDIDATE_NOT_FOUND).noData();
    }

    throw err;
  }
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return judge(req.user.id, req.body.scene, req.body.candidateUserId, req.body.liked);
  }),
];

module.exports = {
  handler,
  apply: judge,
};
