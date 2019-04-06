// @flow

import type { $Request } from 'express';

const jwt = require('jsonwebtoken');
const config = require('config');
const uuid = require('uuid/v4');

const db = require('../../db');
const codes = require('../status-codes');
const apiUtils = require('../utils');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "utln": {
      "description": "The user's Tufts utln. Must be from the Class of 2019",
      "type": "string"
    },
    "code": {
      "description": "The 6-digit code the user was sent in an email",
      "type": "string"
    },
    "expoPushToken": {
      "description": "The push notification token from expo",
      "type": "string"
    }
  },
  "required": ["utln", "code"]
};
/* eslint-enable */

/**
 * @api {post} /api/auth/verify/
 * Verify a user with their verification hacodesh
 */
const verify = async (utln: string, code: number, expoPushToken: ?string) => {
  // Get the user's id and hashed password. Return
  let result = await db.query(`
    UPDATE verification_codes
    SET attempts = attempts + 1
    WHERE utln = $1
    RETURNING code, expiration, attempts, email
  `, [utln]);

  // No email has been sent for this utln
  if (result.rowCount === 0) {
    return apiUtils.status(codes.VERIFY__NO_EMAIL_SENT).noData();
  }

  const verification = result.rows[0];
  const expired = new Date(verification.expiration).getTime() < new Date().getTime();

  // Check if the code is expired
  if (verification.attempts > 3 || expired) {
    return apiUtils.status(codes.VERIFY__EXPIRED_CODE).noData();
  }

  // Check if the code is valid. If not, send a bad code message
  if (verification.code !== code) {
    return apiUtils.status(codes.VERIFY__BAD_CODE).noData();
  }

  // Success! The code is verified!
  // Update the expiration date to ensure that the code can only be used once
  db.query(
    'UPDATE verification_codes SET expiration = $1',
    [new Date()],
  );

  // Check if a user exists for this utln.
  const tokenUUID = uuid();
  result = await db.query(`
    INSERT INTO users
      (utln, email, token_uuid, expo_push_token)
      VALUES ($1, $2, $3, $4)
    ON CONFLICT (utln)
      DO UPDATE
        SET
          successful_logins = users.successful_logins + EXCLUDED.successful_logins,
          token_uuid = $3,
          expo_push_token = $4
    RETURNING id
  `, [utln, verification.email, tokenUUID, expoPushToken]);

  // Get the user from the query results
  const user = result.rows[0];

  // Sign a login token with the user's id and the config secret
  const token = jwt.sign({
    userId: user.id,
    uuid: tokenUUID,
  }, config.secret, {
    expiresIn: 31540000, // expires in 365 days
  });

  // Send the response back!
  return apiUtils.status(codes.VERIFY__SUCCESS).data({
    token,
  });
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return verify(req.body.utln, req.body.code, req.body.expoPushToken);
  }),
];

module.exports = {
  apply: verify,
  handler,
};
