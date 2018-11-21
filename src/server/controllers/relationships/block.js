// @flow

import type { $Request, $Response } from 'express';

const apiUtils = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "userId": {
      "description": "The id ofthe user to block",
      "type": "number",
      "multipleOf": 1 // This asserts that the javascript number is an integer
    }
  },
  "required": ["userId"]
};
/* eslint-enable */

/**
 * @api {post} /api/relationships/block
 *
 */
const block = async (req: $Request, res: $Response) => {
  // NOTES:
  // 1) This query will fail if the candidate does not have a profile. We handle
  //    this specific error in the "catch" block
  // 2) If there is currently no relationship between the two users, a
  //    relationship will be inserted. If there is a relationship, the
  //    relationship will be updated with the desired values
  // 3) The 'last_swipe_timestamp' is always updated to reflect that the
  //    critic has interacted with the candidate
  const { userId } = req.body;
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
    `, [req.user.id, userId]);

    // If the query succeeded, return success
    return res.status(200).json({
      status: codes.BLOCK_SUCCESS,
    });
  } catch (error) {
    // If the query failed due to a voilation of the candidate_user_id fkey
    // into the profiles table, return a more specific error. See here:
    // https://www.postgresql.org/docs/10/errcodes-appendix.html
    if (error.code === '23503' && error.constraint === 'relationships_candidate_user_id_fkey') {
      return res.status(400).json({
        status: codes.JUDGE__CANDIDATE_NOT_FOUND,
      });
    }

    // If the error was not a known error, return a server error.
    return apiUtils.error.server(res, 'Failed to judge candidate.');
  }
};

module.exports = [apiUtils.validate(schema), block];
