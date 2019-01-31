// @flow

import type { $Request } from 'express';

const codes = require('../status-codes');
const apiUtils = require('../utils');

/**
 * @api {get} /api/auth/get-token-utln/
 * Check that a token is valid
 */
const getTokenUtln = async (utln: string) => {
  // If the token is invalid, it will get caught upstream in the `authorized`
  // middleware. If it is valid, the request should include a `user` property
  // including the user's utln, which we will return here.
  return apiUtils.status(200).json({
    status: codes.AUTHORIZED,
    utln,
  });
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getTokenUtln(req.user.utln);
  }),
];

module.exports = {
  apply: getTokenUtln,
  handler,
};
