// @flow

import type { $Request, $Response, $Next } from 'express';

const authUtils = require('../utils');
const codes = require('../../status-codes');

// Middleware to check if the user is authenticated
const authenticated = async (req: $Request, res: $Response, next: $Next) => {
  const { token } = req.body;
  try {
    await authUtils.checkAuthenticated(token);
    return next();
  } catch (error) {
    return res.status(401).json({
      status: codes.UNAUTHORIZED,
    });
  }
};

module.exports = authenticated;
