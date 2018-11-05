// @flow

import type { $Request, $Response } from 'express';

const getProfile = require('./get-profile');

/**
 * @api {get} /api/users/me/profile
 *
 */
const getMyProfile = async (req: $Request, res: $Response) => {
  req.params.userId = req.user.id;
  return getProfile(req, res);
};

module.exports = getMyProfile;
