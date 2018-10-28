// @flow

import type { $Request, $Response } from 'express';

const codes = require('../status-codes');

/**
 * @api {post} /api/users/
 *
 */
const endpoint = async (req: $Request, res: $Response) => {
  return res.status(500).json({
    status: codes.SERVER_ERROR,
    message: 'Not implemented.',
  });
};

module.exports = [endpoint];
