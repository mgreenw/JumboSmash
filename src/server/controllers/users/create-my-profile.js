// @flow

import type { $Request, $Response } from 'express';

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
  "required": ["displayName", "birthday", "image1Url", "bio"]
};
/* eslint-enable */

/**
 * @api {post} /api/users/me/profile
 *
 */
const createMyProfile = async (req: $Request, res: $Response) => {
  // Validate the profile. If validate profile throws, there was a problem with
  // the given profile, which means it was a bad request
  try {
    utils.validateProfile(req.body);
  } catch (error) {
    return res.status(400).send({
      status: codes.CREATE_PROFILE__INVALID_REQUEST,
      message: error,
    });
  }

  const {
    displayName,
    birthday,
    image1Url,
    image2Url,
    image3Url,
    image4Url,
    bio,
  } = req.body;


  try {
    // Insert the profile into the database
    const results = await db.query(`
      INSERT INTO profiles
      (user_id, display_name, birthday, image1_url, image2_url, image3_url, image4_url, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
      RETURNING user_id AS "userId"
    `,
    [req.user.id, displayName, birthday, image1Url, image2Url, image3Url, image4Url, bio]);

    // If no rows were returned, then the profile already exists.
    if (results.rowCount === 0) {
      return res.status(409).json({
        status: codes.CREATE_PROFILE__PROFILE_ALREADY_CREATED,
      });
    }

    // If there is an id returned, success!
    return res.status(201).json({
      status: codes.CREATE_PROFILE__SUCCESS,
    });

  // Catch an error as a server error.
  } catch (error) {
    return apiUtils.error.server(res, 'Failed to insert user profile.');
  }
};

module.exports = [apiUtils.validate(schema), createMyProfile];
