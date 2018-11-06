// @flow

import type { $Request, $Response } from 'express';

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
    "image1Url": {
      "description": "The url to the user's first image.",
      "type": "string"
    },
    "image2Url": {
      "description": "The url to the user's second image.",
      "type": "string"
    },
    "image3Url": {
      "description": "The url to the user's third image.",
      "type": "string"
    },
    "image4Url": {
      "description": "The url to the user's fourth image.",
      "type": "string"
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
const updateMyProfile = async (req: $Request, res: $Response) => {
  // Validate the profile. If validate profile throws, there was a problem with
  // the given profile, which means it was a bad request
  try {
    utils.validateProfile(req.body);
  } catch (error) {
    return res.status(400).send({
      status: codes.BAD_REQUEST,
      message: error,
    });
  }

  // Get all fields from the request body. If the value is not in the request,
  // it will be undefined. The key in this object is the name of the postgres
  // field that relates to this value
  const allFields = {
    display_name: req.body.displayName,
    birthday: req.body.birthday,
    bio: req.body.bio,
    image1_url: req.body.image1Url,
    image2_url: req.body.image2Url,
    image3_url: req.body.image3Url,
    image4_url: req.body.image4Url,
  };

  // Remove all undefined values. Switch the object to an array of pairs
  // for a consistant ordering
  const definedFields = _.toPairs(_.omitBy(allFields, _.isUndefined));

  // If there is nothing to update, success!
  if (definedFields.length === 0) {
    return res.status(201).json({
      status: codes.UPDATE_PROFILE__SUCCESS,
    });
  }

  // Get all the fields with their respective template strings. fieldTemplates
  // is a string like 'display_name = $1, birthday = $2, bio = $3'
  const fieldTemplates = _.join(
    _.map(definedFields, (field, i) => `${_.nth(field, 0)} = $${i + 1}`),
    ', ',
  );

  // Get an array of the fields themselves
  const fields = _.map(definedFields, field => _.nth(field, 1));

  try {
    // Update the profile in the database. Utilize fieldTemplates
    await db.query(`
      UPDATE profiles
      SET ${fieldTemplates}
      WHERE user_id = $${fields.length + 1}
    `,
    [...fields, req.user.id]);

    // If there is an id returned, success!
    return res.status(201).json({
      status: codes.UPDATE_PROFILE__SUCCESS,
    });
  } catch (error) {
    return apiUtils.error.server(res, 'Failed to update user profile.');
  }
};

module.exports = [apiUtils.validate(schema), updateMyProfile];
