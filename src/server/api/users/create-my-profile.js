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
    utils.validateProfile(profile);
  } catch (error) {
    return apiUtils.status(codes.CREATE_PROFILE__INVALID_REQUEST).data({
      message: error,
    });
  }

  const {
    displayName,
    birthday,
    bio,
  } = profile;
  // Get the user's splash photo ID. Error if it does not exist.
  const photoResult = await db.query(`
    SELECT id
    FROM photos
    WHERE user_id = $1
    AND index = 1
    LIMIT 1
  `, [userId]);

  if (photoResult.rowCount === 0) {
    return apiUtils.status(codes.CREATE_PROFILE__PHOTO_REQUIRED).data({});
  }

  const splashPhotoId = photoResult.rows[0].id;

  // Insert the profile into the database
  const results = await db.query(`
    INSERT INTO profiles
    (user_id, display_name, birthday, bio)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT DO NOTHING
    RETURNING user_id AS "userId"
  `,
  [userId, displayName, birthday, bio, splashPhotoId]);

  // If no rows were returned, then the profile already exists.
  if (results.rowCount === 0) {
    return apiUtils.status(codes.CREATE_PROFILE__PROFILE_ALREADY_CREATED).data({});
  }

  // If there is an id returned, success!
  return apiUtils.status(codes.CREATE_PROFILE__SUCCESS).data({});
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
