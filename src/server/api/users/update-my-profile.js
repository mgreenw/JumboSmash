// @flow

import type { $Request } from 'express';

const _ = require('lodash');
const Spotify = require('../artists/utils/Spotify');

const {
  validateProfile,
  profileSelectQuery,
  constructAccountUpdate,
  getFieldTemplates,
  profileErrorMessages,
} = require('./utils');

const apiUtils = require('../utils');
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
    },
    "postgradRegion": {
      "type": ["string", "null"],
      "minLength": 1,
      "maxLength": 100
    },
    "freshmanDorm": {
      "type": ["string", "null"],
      "minLength": 1,
      "maxLength": 100
    },
    "springFlingAct": {
      "type": ["string", "null"],
      "minLength": 1,
      "maxLength": 200
    }
  },
  "required": []
};
/* eslint-enable */

const definedSelect = profileSelectQuery('$1');

/**
 * @api {patch} /api/users/me/profile
 *
 */
const updateMyProfile = async (userId: number, profile: Object) => {
  // Validate the profile. If validate profile throws, there was a problem with
  // the given profile, which means it was a bad request
  let springFlingActArtist;
  try {
    await validateProfile(profile);

    // This is an annoying temorary hack because we want to grab the artist
    if (profile.springFlingAct) {
      springFlingActArtist = await Spotify.get(`artists/${profile.springFlingAct}`);
      if (!springFlingActArtist) {
        throw profileErrorMessages.ARTIST_NOT_FOUND;
      }
    // Set both springFlingAct and artist to null at once.
    } else if (profile.springFlingAct === null) {
      springFlingActArtist = null;
    }
  } catch (error) {
    return apiUtils.status(codes.UPDATE_PROFILE__INVALID_REQUEST).data({
      message: error,
    });
  }

  // Get all fields from the request body. If the value is not in the request,
  // it will be undefined. The key in this object is the name of the postgres
  // field that relates to this value
  const allFields = {
    display_name: profile.displayName,
    birthday: profile.birthday,
    bio: profile.bio,
    postgrad_region: profile.postgradRegion,
    freshman_dorm: profile.freshmanDorm,
    spring_fling_act: profile.springFlingAct,
    spring_fling_act_artist: springFlingActArtist,
  };

  // Remove all undefined values. Switch the object to an array of pairs
  // for a consistant ordering
  const definedFields = _.toPairs(_.omitBy(allFields, _.isUndefined));

  let result;

  // If there is nothing to update, success!
  if (definedFields.length === 0) {
    result = await db.query(`
      SELECT ${definedSelect}
      FROM profiles
      WHERE user_id = $1
    `, [userId]);
  } else {
    // Generates a template and fields for a postgres query
    const template = getFieldTemplates(definedFields);

    // Update the profile in the database. Utilize fieldTemplates and the field
    // length as the parameter templates. It is ok to construct the string like
    // this because none of the values in the construction come from user input
    const userParamIndex = template.fields.length + 1;
    result = await db.query(`
      UPDATE profiles
      SET ${template.templateString}
      WHERE user_id = $${userParamIndex}
      RETURNING ${profileSelectQuery(`${userParamIndex}`)}
    `, [...template.fields, userId]);

    // Mark the profile as needing review ONLY IF display name or bio are updated
    const updatedFields = Object.keys(definedFields);
    const requireReview = updatedFields.includes('bio') || updatedFields.includes('display_name');

    const profileUpdated = constructAccountUpdate({
      type: 'PROFILE_FIELDS_UPDATE',
      changedFields: definedFields,
    });

    await db.query(`
      UPDATE classmates
      SET
        profile_status = CASE WHEN $3 THEN 'updated' ELSE profile_status END,
        account_updates = account_updates || jsonb_build_array($2::jsonb)
      WHERE id = $1
    `, [userId, profileUpdated, requireReview]);
  }

  // If there is an id returned, success!
  return apiUtils.status(codes.UPDATE_PROFILE__SUCCESS).data(result.rows[0]);
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return updateMyProfile(req.user.id, req.body);
  }),
];

module.exports = {
  handler,
  apply: updateMyProfile,
};
