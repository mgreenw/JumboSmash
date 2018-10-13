// @flow

import type { $Request, $Response } from 'express';

const _ = require('lodash');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const db = require('../../db');
const mail = require('../../mail');
const authUtils = require('./utils');
const codes = require('../status-codes');
const utils = require('../utils');

const schema = {
  "type": "object",
  "properties": {
    "utln": {
      "description": "The user's Tufts UTLN. Must be from the Class of 2019",
      "type": "string"
    },
    "password": {
      "description": "The user's desired password",
      "type": "string",
    }
  },
  "required": ["utln", "password"]
};

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

    const { utln, password } = req.body;

    // Ensure the password is strong
    if (!utils.password.validate(password)) {
      return res.status(400).json({
        status: codes.REGISTER__PASSWORD_WEAK,
      });
    }

    // Check Tufts website for proper email
    const { httpResponse } = await authUtils.postForm({ url: 'https://whitepages.tufts.edu/searchresults.cgi', form: { search: utln } });
    const response = await authUtils.get(`https://whitepages.tufts.edu/${httpResponse.headers.location}`);

    if (response.includes('returned no results') || response.includes('match(es)')) {
      return res.status(400).json({
        status: codes.REGISTER__UTLN_NOT_FOUND,
      });
    }

    const dom = new JSDOM(response);
    const { document } = dom.window;

    const table = document.getElementsByClassName('responsive-table')[0];

    const fields = {};
    _.map(table.rows, row => {
      const key = row.cells[0].getElementsByTagName('b')[0].innerHTML.trim().replace(':', '');
      fields[key] = row.cells[1].innerHTML.trim();
    });

    // // Ensure the user's year is 2019.
    // // TODO: offload this to a local database instead of a Tufts server
    if (fields['Class Year'] !== '19') {
      return res.status(400).json({
        status: codes.REGISTER__INVALID_UTLN,
      });
    }
    const email = fields['Email Address'].match(new RegExp('<a href="mailto:' + "(.*)" + '">'))[1].trim();

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
      to: email,
      from: 'jumbosmash19@gmail.com',
      subject: 'JumboSmash Email Verification',
      html: `<p>Click here to verify your email! <a href="${verificationURL}"></a></p>`,
    });

    // Send a success response to the client
    return res.status(200).json({
      status: codes.REGISTER__NEED_TO_VERIFY,
      email,
    });
  } catch (err) {
    // TODO: Log this to a standard logger
    return utils.error.server(res, err);
  }
};

// This is the order of "middleware" to run. First, we validate that the
// incoming request is valid, then we run the register controller.
module.exports = [utils.validate(schema), register];
