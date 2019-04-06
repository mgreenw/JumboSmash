// @flow

import type { $Request, $Response, $Next } from 'express';

const codes = require('../../status-codes');
const { version } = require('../../../utils');

// Middleware to check if the user is an admin and their password is correct
const isAdmin = async (req: $Request, res: $Response, next: $Next) => {
  try {
    if (req.user.isAdmin) return next();

    // If the user is not an admin, respond with the generic "UNAUTHORIZED"
    return res.status(401).json({
      status: codes.UNAUTHORIZED.status,
      version,
    });
  } catch (err) {
    // Server error. Ensure that the 'authenticated' middleware comes before
    // the 'onboarded' middleware
    return res.status(500).json({
      status: 'SERVER_ERROR',
      version,
    });
  }
};

module.exports = isAdmin;
