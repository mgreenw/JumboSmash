// @flow

import type { $Request, $Response } from 'express';

const codes = require('../status-codes');

/**
 * @api {get} /api/auth/get-token-utln/
 * Check that a token is valid
 */
const getTokenUtln = async (req: $Request, res: $Response) => {
  // If the token is invalid, it will get caught upstream in the `authorized`
  // middleware. If it is valid, the request should include a `user` property
  // including the user's utln, which we will return here.
  return res.status(200).json({
    status: codes.AUTHORIZED,
    utln: req.user.utln,
  });
};

module.exports = [getTokenUtln];
