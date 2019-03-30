// @flow

import type { $Request } from 'express';
import updateMyProfileSchema from './update-my-profile';

const apiUtils = require('../utils');
const { validateProfile, profileSelectQuery } = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  ...updateMyProfileSchema,
  "required": ["displayName", "birthday", "bio"]
};
/* eslint-enable */

/**
 * @api {post} /api/users/me/profile
 *
 */
const createMyProfile = async (userId: number, profile: Object) => {
  // Validate the profile. If validate profile throws, there was a problem with
  // the given profile, which means it was a bad request
  try {
    validateProfile(profile);
  } catch (error) {
    return apiUtils.status(codes.FINALIZE_PROFILE_SETUP__INVALID_REQUEST).data({
      message: error,
    });
  }

  const {
    displayName,
    birthday,
    bio,
  } = profile;
  // Ensure that the user has a photo uploaded. Error if it does not exist.
  const photoResult = await db.query(`
    SELECT id
    FROM photos
    WHERE user_id = $1
    AND index = 1
    LIMIT 1
  `, [userId]);

  if (photoResult.rowCount === 0) {
    return apiUtils.status(codes.FINALIZE_PROFILE_SETUP__PHOTO_REQUIRED).noData();
  }

  // Insert the profile into the database
  const results = await db.query(`
    INSERT INTO profiles
    (user_id, display_name, birthday, bio)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id) DO UPDATE
      SET display_name = EXCLUDED.display_name
    RETURNING
      ${profileSelectQuery('$5')},
      (xmax::text::int > 0) as existed
  `,
  [userId, displayName, birthday, bio, userId]);

  const [{ existed, ...finalizedProfile }] = results.rows;

  return apiUtils.status(
    existed
      ? codes.FINALIZE_PROFILE_SETUP__PROFILE_ALREADY_CREATED
      : codes.FINALIZE_PROFILE_SETUP__SUCCESS,
  ).data(finalizedProfile);
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return createMyProfile(req.user.id, req.body);
  }),
];

module.exports = {
  handler,
  apply: createMyProfile,
};
