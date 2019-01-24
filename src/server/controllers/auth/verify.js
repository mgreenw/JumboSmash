// @flow

import type { $Request, $Response } from 'express';

const jwt = require('jsonwebtoken');
const config = require('config');

const db = require('../../db');
const codes = require('../status-codes');
const utils = require('../utils');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "utln": {
      "description": "The user's Tufts UTLN. Must be from the Class of 2019",
      "type": "string"
    },
    "code": {
      "description": "The 6-digit code the user was sent in an email",
      "type": "string"
    }
  },
  "required": ["utln", "code"]
};
/* eslint-enable /*

/**
 * @api {post} /api/auth/verify/
 * Verify a user with their verification hacodesh
 */
const verify = async (req: $Request, res: $Response) => {
try {

    const { utln, code } = req.body;

    // Get the user's id and hashed password. Return
    let result = await db.query(`
      UPDATE verification_codes
      SET attempts = attempts + 1
      WHERE utln = $1
      RETURNING code, expiration, attempts, email`,
      [utln],
    );

    // No email has been sent for this utln
    if (result.rowCount === 0) {
      return res.status(401).json({
        status: codes.VERIFY__NO_EMAIL_SENT,
      });
    }

    const verification = result.rows[0];
    const expired = new Date(verification.expiration).getTime() < new Date().getTime();

    // Check if the code is expired
    if (verification.attempts > 3 || expired) {
      return res.status(400).json({
        status: codes.VERIFY__EXPIRED_CODE,
      });
    }

    // Check if the code is valid. If not, send a bad code message
    if (verification.code !== code) {
      return res.status(400).json({
        status: codes.VERIFY__BAD_CODE,
      });
    }

    // Success! The code is verified!
    // Update the expiration date to ensure that the code can only be used once
    db.query(
      'UPDATE verification_codes SET expiration = $1',
      [new Date()],
    );

    // Check if a user exists for this utln.
    result = await db.query(`
      INSERT INTO users
        (utln, email)
        VALUES ($1, $2)
      ON CONFLICT (utln)
        DO UPDATE
          SET successful_logins = users.successful_logins + EXCLUDED.successful_logins
      RETURNING id
    `,
      [utln, verification.email]
    );

    // Get the user from the query results
    const user = result.rows[0];

    // Sign a login token with the user's id and the config secret
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 31540000, // expires in 365 days
    });

    // Send the response back!
    return res.status(200).json({
      status: codes.VERIFY__SUCCESS,
      token,
    });

  // In the case of an unknown error, respond with a generic error.
  } catch (err) {
    // TODO: Add logging of a problem
    return utils.error.server(res, err, 'Failed to verify user');
  }
};

module.exports = [utils.validate(schema), verify];
