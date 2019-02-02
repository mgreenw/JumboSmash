// @flow

import type { $Request } from 'express';

const _ = require('lodash');

const utils = require('./utils');
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
    }
  },
  "required": []
};
/* eslint-enable */

/**
 * @api {patch} /api/users/me/profile
 *
 */
const updateMyProfile = async (userId: number, profile: Object) => {
  // Validate the profile. If validate profile throws, there was a problem with
  // the given profile, which means it was a bad request
  try {
    utils.validateProfile(profile);
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
  };

  // Remove all undefined values. Switch the object to an array of pairs
  // for a consistant ordering
  const definedFields = _.toPairs(_.omitBy(allFields, _.isUndefined));

  // If there is nothing to update, success!
  if (definedFields.length === 0) {
    return apiUtils.status(codes.UPDATE_PROFILE__SUCCESS).data({});
  }

  // Generates a template and fields for a postgres query
  const template = utils.getFieldTemplates(definedFields);

  // Update the profile in the database. Utilize fieldTemplates and the field
  // length as the parameter templates. It is ok to construct the string like
  // this because none of the values in the construction come from user input
  await db.query(`
    UPDATE profiles
    SET ${template.templateString}
    WHERE user_id = $${template.fields.length + 1}`,
  [...template.fields, userId]);

  // If there is an id returned, success!
  return apiUtils.status(codes.UPDATE_PROFILE__SUCCESS).data({});
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
