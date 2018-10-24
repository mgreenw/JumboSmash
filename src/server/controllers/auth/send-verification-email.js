// @flow

import type { $Request, $Response } from 'express';

const _ = require('lodash');
const jsdom = require('jsdom');

const db = require('../../db');
const mail = require('../../mail');
const authUtils = require('./utils');
const codes = require('../status-codes');
const utils = require('../utils');

const { JSDOM } = jsdom;

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "utln": {
      "description": "The user's Tufts UTLN. Must be from the Class of 2019",
      "type": "string"
    },
    "forceResend": {
      "description": "If true, then asks the server to resend the verification email, even if a code is still valid.",
      "type": "boolean"
    }
  },
  "required": ["utln"]
};
/* eslint-enable /*

/**
 * @api {post} /api/auth/register
 * Register a user. Send a verification email to the user
 *
 * @apiParam (Request body) {string} utln The user's Tufts UTLN
 * @apiParam (Request body) {boolean} forceResend If the email should be resent
 *  if a code has already be sent
 *
 */
const sendVerificationEmail = async (req: $Request, res: $Response) => {
  try {
    const { utln, forceResend } = req.body;

    const oldCodeResults = await db.query(
      'SELECT code, email, email_sends, last_email_send, expiration, verification_attempts FROM verification_codes WHERE utln = $1',
      [utln],
    );

    // Get the number of email sends if an email has already been sent.
    let emailSends = 0;
    if (oldCodeResults.rowCount > 0) {
      const code = oldCodeResults.rows[0];
      emailSends = code.email_sends;

      // Check if the old code that was sent is expired
      const oldCodeExpired = authUtils.verificationCodeExpired(code.expiration, code.verification_attempts);

      // If it has not expired AND we are not forcing a resend,
      // respond that the email has already been sent
      if (forceResend !== true && !oldCodeExpired) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Already sent code: ${code.code}`);
        }
        return res.status(200).json({
          status: codes.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT,
          email: code.email,
        });
      }
    }

    // Check Tufts website for proper email. We need to follow redirects
    const { body } = await authUtils.postForm({
      followAllRedirects: true,
      url: 'https://whitepages.tufts.edu/searchresults.cgi',
      form: { search: utln }
    });

    // If no results were found for that UTLN, send an error.
    if (body.includes('returned no results') || body.includes('match(es)')) {
      return res.status(400).json({
        status: codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND,
      });
    }

    // Parse the user's data from the White Pages
    const dom = new JSDOM(body);
    const { document } = dom.window;
    const table = document.getElementsByClassName('responsive-table')[0];
    const fields = {};
    _.map(table.rows, row => {
      const key = row.cells[0].getElementsByTagName('b')[0].innerHTML.trim().replace(':', '');
      fields[key] = row.cells[1].innerHTML.trim();
    });

    // Ensure the user's year is 2019.
    // TODO: offload this to a local database instead of a Tufts server
    if (fields['Class Year'] !== '19') {
      return res.status(400).json({
        status: codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_2019,
      });
    }

    // Regex for the user's email from the White Pages.
    const email = fields['Email Address'].match(new RegExp('<a href="mailto:' + "(.*)" + '">'))[1].trim();

    // Code range is 000000 to 999999
    const verificationCode = Math.floor(Math.random() * (999999 + 1)).toString().padStart(6, '000000');

    // Set an expiration date for the verification hash
    const now = new Date();
    const expirationDate = new Date(now.getTime() + (10 * 60000)); // 10 minutes from now

    // Upsert the verification code into the database.
    const result = await db.query(
      'INSERT INTO verification_codes (utln, code, expiration, verification_attempts, email) VALUES($1, $2, $3, 0, $4) ON CONFLICT (utln) DO UPDATE SET (code, expiration, last_email_send, email_sends, verification_attempts, email) = ($5, $6, now(), $7, 0, $8) RETURNING id',
      [utln, verificationCode, expirationDate, email, verificationCode, expirationDate, emailSends + 1, email],
    );

    // If the insert did not return any rows, the user has already registered.
    // Something went wrong! Maybe another user registered with the same
    // UTLN between the start of this method and now.
    if (result.rows.length === 0) {
      throw 'Failed to upsert the verification code into the database. Error.';
    }

    // Create the verification url and send the email!
    // TODO: Ensure that the mail sent.
    mail.send({
      to: email,
      from: 'jumbosmash19@gmail.com',
      subject: 'JumboSmash Email Verification',
      html: `<p>Enter this code: ${verificationCode}</p>`,
    });

    // Send a success response to the client
    return res.status(200).json({
      status: codes.SEND_VERIFICATION_EMAIL__SUCCESS,
      email,
    });
  } catch (err) {
    // TODO: Log this to a standard logger
    return utils.error.server(res, err);
  }
};

// This is the order of "middleware" to run. First, we validate that the
// incoming request is valid, then we run the register controller.
module.exports = [utils.validate(schema), sendVerificationEmail];
