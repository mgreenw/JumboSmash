// @flow

import type { $Request, $Response, $Next } from 'express';

const config = require('config');
const jwt = require('jsonwebtoken');

const db = require('../../../db');
const codes = require('../../status-codes');

function getUser(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('secret'), async (err, decoded) => {
      if (err) return reject();
      try {
        // Get the user from the users table. If the user has a profile setup,
        // join with that profile. If not, the 'profile' field will be null
        const result = await db.query(
          `
          SELECT u.id, COALESCE(p.user_id, 0)::boolean AS "hasProfile", u.utln, u.token_uuid AS "tokenUUID"
          FROM users u
          LEFT JOIN profiles p ON p.user_id = u.id
          WHERE u.id = $1
          LIMIT 1`,
          [decoded.userId],
        );

        // If no user exists with that id, fail
        if (result.rowCount === 0) {
          return reject();
        }

        // Check if the user's token's uuid is valid
        const user = result.rows[0];
        if (user.tokenUUID === null || decoded.uuid !== user.tokenUUID) {
          return reject();
        }

        // If a user exists, return the user!
        return resolve(result.rows[0]);

        // If there is an unknown error, reject
      } catch (error) {
        return reject();
      }
    });
  });
}

// Middleware to check if the user is authenticated
const authenticated = async (req: $Request, res: $Response, next: $Next) => {
  // Get the auth token. If it does not exist, return a bad request.
  const token = req.get('Authorization');
  if (token === undefined) {
    return res.status(400).json({
      status: codes.BAD_REQUEST.status,
      message: 'Missing Authorization header.',
    });
  }

  try {
    // Set the request's "user" property to be the user object (user
    // and profile if the user has setup their profile)
    req.user = await getUser(token);

    // Go to the next middleware
    return next();

  // If there is an error getting the user (like the user does not exist),
  // return with UNAUTHORIZED
  } catch (error) {
    return res.status(401).json({
      status: codes.UNAUTHORIZED.status,
    });
  }
};

module.exports = authenticated;
