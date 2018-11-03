// @flow

import type { $Request, $Response, $Next } from 'express';

const authUtils = require('../utils');
const codes = require('../../status-codes');

// Middleware to check if the user is authenticated
const authenticated = async (req: $Request, res: $Response, next: $Next) => {
  // Get the auth token. If it does not exist, return a bad request.
  const token = req.get('Authorization');
  if (token === undefined) {
    return res.status(400).json({
      status: codes.BAD_REQUEST,
      message: 'Missing Authorization header.',
    });
  }

  try {
    // Set the request's "user" property to be the user object (user
    // and profile if the user has setup their profile)
    req.user = await authUtils.getUser(token);

    // Go to the next middleware
    return next();

  // If there is an error getting the user (like the user does not exist),
  // return with UNAUTHORIZED
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: codes.UNAUTHORIZED,
    });
  }
};

module.exports = authenticated;
