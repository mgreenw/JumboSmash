// @flow

import type { $Request } from 'express';

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {},
  "required": []
};
/* eslint-enable */

/**
 * @api {post} /api/users/:userId/profile
 *
 */
const getProfile = async (userId: number) => {
  // Get if the user id is a valid integer. If not, error with a bad request
  if (Number.isNaN(userId)) {
    return apiUtils.status(codes.GET_PROFILE__BAD_USER_ID).data({});
  }

  // Try to get the user from the profiles table
  const result = await db.query(`
    SELECT
      json_build_object(
        'displayName', display_name,
        'birthday', to_char(birthday, 'YYYY-MM-DD'),
        'bio', bio
      ) AS fields,
      ARRAY(
        SELECT id
        FROM photos
        WHERE user_id = $1
        ORDER BY index
      ) AS "photoIds"
    FROM profiles
    WHERE user_id = $2
  `, [userId, userId]);

  // If the user is not in the database, respond with 'not found'
  if (result.rowCount === 0) {
    return apiUtils.status(codes.GET_PROFILE__PROFILE_NOT_FOUND).data({});
  }

  // If the profile was found, return it!
  return apiUtils.status(codes.GET_PROFILE__SUCCESS).data(result.rows[0]);
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getProfile(parseInt(req.params.userId, 10));
  }),
];

module.exports = {
  handler,
  apply: getProfile,
};
