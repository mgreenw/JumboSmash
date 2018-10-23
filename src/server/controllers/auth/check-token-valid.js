// @flow

import type { $Request, $Response } from 'express';

const codes = require('../status-codes');
const utils = require('../utils');
const authUtils = require('./utils');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "utln": {
      "description": "The user's Tufts UTLN. Must be from the Class of 2019",
      "type": "string"
    },
    "token": {
      "description": "The authentication token for a logged in user",
      "type": "string"
    }
  },
  "required": ["utln", "token"]
};
/* eslint-enable /*

/**
 * @api {post} /api/auth/checkTokenValid/
 * Verify a user with their verification hacodesh
 */
const checkTokenValid = async (req: $Request, res: $Response) => {
  const { utln, token } = req.body;

  try {
    // Check if the token is valid, and get the UTLN associated
    // with the token
    const expectedUtln = await authUtils.checkAuthenticated(token);

    // Check if the UTLN passed to the endpoint is equal to the one
    // we expected given the login token. If not, reject the request
    if (utln !== expectedUtln) {
      return res.status(401).json({
        status: codes.UNAUTHORIZED
      });
    }

    // If the UTLN is correct, respond with AUTHORIZED
    return res.status(200).json({
      status: codes.AUTHORIZED,
    });

  // If the checkAuthenticated() promise throws, respond with unauthorized
  } catch (error) {
    return res.status(401).json({
      status: codes.UNAUTHORIZED,
    });
  }
};

module.exports = [utils.validate(schema), checkTokenValid];
