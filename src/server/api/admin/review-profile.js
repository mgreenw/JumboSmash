// @flow

import type { $Request } from 'express';

const { status, asyncHandler, validate } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');
const slack = require('../../slack');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "canBeSwipedOn": {
      "type": "boolean"
    },
    "canBeActiveInScenes": {
      "type": "boolean"
    },
    "comment": {
      "type": "string",
      "minLength": 5,
      "maxLength": 500,
    },
  },
  "required": ["canBeSwipedOn", "canBeActiveInScenes", "comment"]
};
/* eslint-enable */

/**
 * @api {post} /admin/classmates/:userId/review
 *
 */
const reviewProfile = async (
  userId: number,
  canBeSwipedOn: boolean,
  canBeActiveInScenes: boolean,
  comment: string,
) => {
  return status(codes.REVIEW_PROFILE__SUCCESS).noData();
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return reviewProfile(
      req.params.userId,
      req.body.canBeSwipedOn,
      req.body.canBeActiveInScenes,
      req.body.comment,
    );
  }),
];

module.exports = {
  handler,
  apply: reviewProfile,
};
