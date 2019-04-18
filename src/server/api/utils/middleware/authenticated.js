// @flow

import type { $Request, $Response, $Next } from 'express';

const Sentry = require('@sentry/node');
const codes = require('../../status-codes');
const { getUser, AuthenticationError } = require('../../auth/utils');
const { profileErrorMessages } = require('../../users/utils');
const { version } = require('../../../utils');

// Middleware to check if the user is authenticated
const authenticated = async (req: $Request, res: $Response, next: $Next) => {
  // Get the auth token. If it does not exist, return a bad request.
  const token = req.get('Authorization');
  if (token === undefined) {
    return res.status(400).json({
      status: codes.BAD_REQUEST.status,
      message: 'Missing Authorization header.',
      version,
    });
  }

  try {
    // Set the request's "user" property to be the user object (user
    // and profile if the user has setup their profile).
    // If Admin-Authorization is null, the isAdmin will be false. Admins
    // must be authenticated by 1) being a user and 2) by supplying the correct password
    req.user = await getUser(token, req.get('Admin-Authorization'));

    Sentry.getHubFromCarrier(req).configureScope((scope) => {
      scope.setUser({
        ...req.user,
        username: req.user.utln,
        id_address: req.connection.remoteAddress,
      });
    });

    // Go to the next middleware
    return next();

  // If there is an error getting the user (like the user does not exist),
  // return with UNAUTHORIZED
  } catch (error) {
    if (error instanceof AuthenticationError) {
      // If the user is not terminated, return unauthorized
      if (!error.terminated) {
        return res.status(401).json({
          status: codes.UNAUTHORIZED.status,
          version,
        });
      }

      // If the user is terminated, return as such.
      const reason = error.terminationReason === profileErrorMessages.BIRTHDAY_UNDER_18
        ? profileErrorMessages.BIRTHDAY_UNDER_18
        : null;

      const body = {
        status: codes.TERMINATED.status,
        version,
        data: {
          reason,
        },
      };

      return res.status(401).json(body);
    }
    return next(error);
  }
};

module.exports = authenticated;
