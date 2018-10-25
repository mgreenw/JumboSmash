// @flow

import type { $Request, $Response, $Next } from 'express';

const authUtils = require('../utils');
const codes = require('../../status-codes');

// Middleware to check if the user is authenticated
const authenticated = async (req: $Request, res: $Response, next: $Next) => {
  const token = req.get('Authorization');
  try {
    // Set the request's "user" property to be the user's id and utln
    req.user = await authUtils.checkAuthenticated(token);

    // Go to the next middleware
    return next();
  } catch (error) {
    return res.status(401).json({
      status: codes.UNAUTHORIZED,
    });
  }
};

module.exports = authenticated;
