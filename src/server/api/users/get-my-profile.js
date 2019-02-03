// @flow

import type { $Request } from 'express';

const getProfile = require('./get-profile').apply;
const apiUtils = require('../utils');

/**
 * @api {get} /api/users/me/profile
 *
 */
const getMyProfile = async (userId: number) => {
  return getProfile(userId);
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getMyProfile(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: getMyProfile,
};
