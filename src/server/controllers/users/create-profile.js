// @flow

import type { $Request, $Response } from 'express';

const utils = require('../utils');
const codes = require('../status-codes');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "utln": {
      "description": "The user's Tufts UTLN. Must be from the Class of 2019",
      "type": "string"
    },
    "code": {
      "description": "The 6-digit code the user was sent in an email",
      "type": "string"
    }
  },
  "required": ["utln"]
};
/* eslint-enable /*

/**
 * @api {post} /api/users/profile
 *
 */
const createProfile = async (req: $Request, res: $Response) => {

  // Fields:
  // display_name (First Name)
  // birthday
  // image1_url
  // bio (optional)

  // First, we want to check if this user already has a profile
  // if they do, we will return that they have already setup their
  // profile and that they should use the PATCH version of this endpoint
  // CREATE_PROFILE__PROFILE_ALREADY_CREATED

  // Next, we will validate that all of the fields are correct. They will
  // already be 'validated' to exist, but we want to check the actual content
  // of the fields
  return res.status(500).json({
    status: codes.SERVER_ERROR,
    message: 'Not implemented.',
  });
};

module.exports = [utils.validate(schema), createProfile];
