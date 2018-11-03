// @flow

import type { $Request, $Response } from 'express';

const utils = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');

const minBirthday = new Date('01/01/1988');
const maxBirthday = new Date('01/01/2001');
const displayNameMaxLength = 50;
const bioMaxLength = 500;

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
/* eslint-enable /*

/**
 * @api {post} /api/users/me/profile
 *
 */
const createProfile = async (req: $Request, res: $Response) => {
  const { displayName, birthday, image1Url, image2Url, image3Url, image4Url, bio } = req.body;

  // Check if the user's display name is too long
  const CREATE_PROFILE__DISPLAY_NAME_TOO_LONG = 'CREATE_PROFILE__DISPLAY_NAME_TOO_LONG';
  if (displayName.length > displayNameMaxLength) {
    return res.status(400).json({
      status: CREATE_PROFILE__DISPLAY_NAME_TOO_LONG,
    });
  }

  // Check that the birthday is in a reasonable range
  const birthdayDate = new Date(birthday);
  const CREATE_PROFILE__BIRTHDAY_NOT_VALID = 'CREATE_PROFILE__BIRTHDAY_NOT_VALID';
  if (birthdayDate < minBirthday || birthdayDate > maxBirthday) {
    return res.status(400).json({
      status: CREATE_PROFILE__BIRTHDAY_NOT_VALID,
    });
  }

  // Check if the user's bio is too long
  const CREATE_PROFILE__BIO_TOO_LONG = 'CREATE_PROFILE__BIO_TOO_LONG';
  if (bio.length > bioMaxLength) {
    return res.status(400).json({
      status: CREATE_PROFILE__BIO_TOO_LONG,
    });
  }

  // Ensure all supplied urls are valid urls
  const CREATE_PROFILE__IMAGE_URL_NOT_VALID = 'CREATE_PROFILE__IMAGE_URL_NOT_VALID';
  const urls = [image1Url, image2Url, image3Url, image4Url];
  urls.forEach((url, index) => {
    if (url !== undefined && !utils.isValidUrl(url)) {
      return res.status(400).json({
        status: CREATE_PROFILE__IMAGE_URL_NOT_VALID,
        url,
        image: index + 1
      });
    }
  });

  try {
    const result = await db.query(`
      INSERT INTO profiles
      (user_id, display_name, birthday, image1_url, image2_url, image3_url, image4_url, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
      RETURNING id
    `,
    [req.user.id, displayName, birthday, image1Url, image2Url, image3Url, image4Url, bio]);

    if (result.rowCount === 0) {
      const CREATE_PROFILE__PROFILE_ALREADY_CREATED = 'CREATE_PROFILE__PROFILE_ALREADY_CREATED';
      return res.status(409).json({
        status: CREATE_PROFILE__PROFILE_ALREADY_CREATED
      });
    }

    const CREATE_PROFILE__SUCCESS = 'CREATE_PROFILE__SUCCESS';
    return res.status(201).json({
      status: CREATE_PROFILE__SUCCESS
    });

  } catch (error) {
    return utils.error.server(res, 'Failed to insert user profile.');
  }
};

module.exports = [utils.validate(schema), createProfile];
