// @flow

import type { $Request, $Response, $Next } from 'express';

const utils = require('../../utils');
const codes = require('../../status-codes');

// Middleware to check if the user is authenticated
const hasProfile = async (req: $Request, res: $Response, next: $Next) => {
  try {
    // If the request's user id is undefined, the user is not in the users
    // table yet, which implies that they are not onboarded.
    const { profileId } = req.user;
    if (profileId === null) {
      return res.status(403).json({
        status: codes.PROFILE_SETUP_INCOMPLETE,
      });
    }

    // If the user's id is defined, go to the next route!
    return next();
  } catch (_) {
    // Server error. Ensure that the 'authenticated' middleware comes before
    // the 'onboarded' middleware
    return utils.error.server(res, 'No user found. Perhaps the user authentication check has not yet occured.');
  }
};

module.exports = hasProfile;
