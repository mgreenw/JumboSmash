// @flow

import type { $Request, $Response, $Next } from 'express';

const codes = require('../../status-codes');

// Middleware to check if the user is authenticated
const onboarded = async (req: $Request, res: $Response, next: $Next) => {
  const { id } = req.user;
  if (id === undefined) {
    return res.status(403).json({
      status: codes.ONBOARDING_INCOMPLETE,
    });
  }

  return next();
};

module.exports = onboarded;
