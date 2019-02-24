// @flow

import type { $Request } from 'express';

const db = require('../../db');
const { profileSelectQuery } = require('./utils');
const { userIsBanned, asyncHandler, status } = require('../utils');
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
    return status(codes.GET_PROFILE__BAD_USER_ID).noData();
  }

  // Ensure the user is not banned
  if (await userIsBanned(userId)) {
    return status(codes.GET_PROFILE__PROFILE_NOT_FOUND).noData();
  }

  // Try to get the user from the profiles table
  const result = await db.query(`
    SELECT ${profileSelectQuery('$1')}
    FROM profiles
    WHERE user_id = $1
  `, [userId]);

  // If the user is not in the database, respond with 'not found'
  if (result.rowCount === 0) {
    return status(codes.GET_PROFILE__PROFILE_NOT_FOUND).noData();
  }

  // If the profile was found, return it!
  return status(codes.GET_PROFILE__SUCCESS).data(result.rows[0]);
};

const handler = [
  asyncHandler(async (req: $Request) => {
    return getProfile(parseInt(req.params.userId, 10));
  }),
];

module.exports = {
  handler,
  apply: getProfile,
};
