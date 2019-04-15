// @flow

import type { $Request } from 'express';

const apiUtils = require('../utils');
const {
  validateProfile,
  profileSelectQuery,
  profileErrorMessages,
  constructAccountUpdate,
} = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "displayName": {
      "description": "The user's display name. It should be their first name.",
      "type": "string"
    },
    "birthday": {
      "description": "The user's birthday",
      "type": "string",
      "format": "date",
    },
    "bio": {
      "description": "The user's bio!",
      "type": "string"
    }
  },
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
    // If the user entered a birthday under 18, terminated the user immediately.
    if (error === profileErrorMessages.BIRTHDAY_UNDER_18) {
      const terminationUpdate = constructAccountUpdate({
        type: 'ACCOUNT_TERMINATION',
        admin: 'server',
        reason: profileErrorMessages.BIRTHDAY_UNDER_ID,
      });

      await db.query(`
        UPDATE classmates
        SET
          terminated = true,
          termination_reason = $2,
          account_updates = account_updates || jsonb_build_array($3::jsonb)
        WHERE id = $1
      `, [userId, profileErrorMessages.BIRTHDAY_UNDER_18, terminationUpdate]);

      return apiUtils.status(codes.FINALIZE_PROFILE__BIRTHDAY_UNDER_18).noData();
    }

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

  // Add an account update if the profile is being created.
  if (!existed) {
    const profileCreatedUpdate = constructAccountUpdate({
      type: 'PROFILE_UPDATE',
      changedFields: { displayName, birthday, bio },
    });

    await db.query(`
      UPDATE classmates
      SET account_updates = account_updates || jsonb_build_array($2::jsonb)
      WHERE id = $1
    `, [userId, profileCreatedUpdate]);
  }

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
