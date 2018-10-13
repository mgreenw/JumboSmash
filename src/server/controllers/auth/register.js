// @flow

import type { $Request, $Response } from 'express';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const db = require('../../db');
const mail = require('../../mail');
const apiUtils = require('./utils');

/**
 * @api {post} /api/auth/register
 * Register a user. Send a verification email to the user
 *
 * @apiParam (Request body) {string} utln The user's Tufts UTLN
 * @apiParam (Request body) {string} password The user's desired password
 *
 */
const register = async (req: $Request, res: $Response) => {
  try {
    const { utln } = req.body;

    // Check Tufts website for proper email
    const { httpResponse } = await apiUtils.postForm({ url: 'https://whitepages.tufts.edu/searchresults.cgi', form: { type: 'Students', search: utln } });
    const response = await apiUtils.get(`https://whitepages.tufts.edu/${httpResponse.headers.location}`);
    const year = response.split('<b>Class Year: </b>')[1].split('</td></div><td>')[1].split('</td></tr><tr><td>')[0].trim();

    // Ensure the user's year is 2019.
    // TODO: offload this to a local database instead of a Tufts server
    if (year !== '19') {
      throw new Error('Could not register user: not in class of 2019');
    }

    // Create a random 40 char string to use to verify a user
    const verificationHash = crypto.randomBytes(20).toString('hex');

    // Set an expiration date for the verification hash
    const now = new Date();
    const expirationDate = new Date(now.getTime() + (10 * 60000)); // 10 minutes from now

    // Hash the password
    // TODO: ensure password is correct length and strength
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Add the user to the database
    const result = await db.query(
      'INSERT INTO users(utln, password, verification_hash, verification_expire_date) VALUES($1, $2, $3, $4) RETURNING id',
      [utln, hashedPassword, verificationHash, expirationDate],
    );

    // If the insert failed, throw an error. Already registered.
    if (result.rows.length === 0) {
      throw new Error('Could not insert new user into the users table.');
    }

    // Create the verification url and send the email!
    const verificationURL = `http://${req.get('host')}/api/auth/verify/${verificationHash}`;
    mail.send({
      to: `${utln}@tufts.edu`,
      from: 'jumbosmash19@gmail.com',
      subject: 'JumboSmash Email Verification',
      html: `<p>Click here to verify your email! <a href="${verificationURL}"></a></p>`,
    });

    // Send a success response to the client
    return res.status(200).send({ expiration: expirationDate });
  } catch (err) {
    // TODO: Log this to a standard logger
    return res.status(500).send('There was a problem registering the user.');
  }
};

module.exports = register;
