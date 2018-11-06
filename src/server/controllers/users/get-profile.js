// @flow

import type { $Request, $Response } from 'express';

const db = require('../../db');
const utils = require('../utils');
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
const getProfile = async (req: $Request, res: $Response) => {
  // Get the user's id as in integer
  const userId = parseInt(req.params.userId, 10);

  // Get if the user id is a valid integer. If not, error with a bad request
  if (Number.isNaN(userId)) {
    return res.status(400).json({
      status: codes.GET_PROFILE__BAD_USER_ID,
    });
  }

  // Try to get the user from the profiles table
  try {
    const result = await db.query(`
      SELECT
        display_name as "displayName",
        birthday,
        bio,
        image1_url as "image1Url",
        image2_url as "image2Url",
        image3_url as "image3Url",
        image4_url as "image4Url"
      FROM profiles
      WHERE user_id = $1`, [userId]);

    // If the user is not in the database, respond with 'not found'
    if (result.rowCount === 0) {
      return res.status(404).json({
        status: codes.GET_PROFILE__PROFILE_NOT_FOUND,
      });
    }

    // If the profile was found, return it!
    const profile = result.rows[0];
    profile.birthday = profile.birthday.toISOString().substring(0, 10);
    return res.status(200).json({
      status: codes.GET_PROFILE__SUCCESS,
      profile,
    });

  // On error, return a server error.
  } catch (error) {
    return utils.error.server(res, 'Failed to get user profile.');
  }
};

module.exports = getProfile;
