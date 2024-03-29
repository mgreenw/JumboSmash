// @flow

import type { $Request, $Response, $Next } from 'express';

const codes = require('../../status-codes');

const { version } = require('../../../utils');

// Middleware to check if the user is authenticated
const hasProfile = async (req: $Request, res: $Response, next: $Next) => {
  try {
    // If the request's user id is undefined, the user is not in the users
    // table yet, which implies that they are not onboarded.
    if (!req.user.hasProfile) {
      return res.status(403).json({
        status: codes.PROFILE_SETUP_INCOMPLETE.status,
        version,
      });
    }

    // If the user's id is defined, go to the next route!
    return next();
  } catch (err) {
    // Server error. Ensure that the 'authenticated' middleware comes before
    // the 'onboarded' middleware. This will be capture by Sentry.
    return res.status(500).json({
      status: 'SERVER_ERROR',
      version,
    });
  }
};

module.exports = hasProfile;
