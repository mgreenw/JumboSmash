// @flow

import type { $Request, $Response } from 'express';

const utils = require('../utils');
const codes = require('../status-codes');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {},
  "required": []
};
/* eslint-enable */

/**
 * @api {get} /api/users/me/profile
 *
 */
const getMyProfile = async (req: $Request, res: $Response) => {
  return res.status(500).json({
    status: codes.SERVER_ERROR,
    message: 'Not implemented.',
  });
};

module.exports = [utils.validate(schema), getMyProfile];
