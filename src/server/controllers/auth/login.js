// @flow

import type { $Request, $Response } from 'express';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const db = require('../../db');

/**
 * @api {post} /api/auth/login
 * Login a user
 *
 * @apiParam (Request body) {string} utln The user's Tufts UTLN
 * @apiParam (Request body) {string} password The user's password
 *
 */
const login = async (req: $Request, res: $Response) => {
  try {
    // Get the user's id and hashed password
    const result = await db.query(
      'SELECT id, password FROM users WHERE utln = $1 LIMIT 1',
      [req.body.utln],
    );

    // If there are no results, respond with an error.
    if (result.rows.length < 1) {
      return res.status(401).send({ error: 'Incorrect username or password' });
    }

    // Get the user from the query results
    const user = result.rows[0];

    // Check if the password is valid. If invalid, respond with an error.
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ error: 'Incorrect username or password' });
    }

    // Sign a login token with the user's id and the config secret
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 31540000, // expires in 365 days
    });

    // Send the response back!
    return res.status(200).send({ auth: true, token });

  // In the case of an unknown error, respond with a generic error.
  } catch (err) {
    // TODO: Add logging of a problem
    return res.status(500).send({ error: 'There was a problem logging in' });
  }
};

module.exports = login;
