// @flow

import type { $Request } from 'express';

const _ = require('lodash');

const logger = require('../../logger');
const db = require('../../db');
const mail = require('../../mail');
const slack = require('../../slack');
const authUtils = require('./utils');
const apiUtils = require('../utils');
const codes = require('../status-codes');

/* eslint-disable */
const schema = {
  type: 'object',
  properties: {
    utln: {
      description: "The user's Tufts UTLN. Must be from the Class of 2019",
      type: 'string',
    },
    forceResend: {
      description:
        'If true, then asks the server to resend the verification email, even if a code is still valid.',
      type: 'boolean',
    },
  },
  required: ['utln'],
};
/* eslint-enable */

/**
 * @api {post} /api/auth/register
 *
 */

const sendVerificationEmail = async (utln: string, forceResend: boolean) => {
  const oldCodeResults = await db.query(
    'SELECT code, email, email_sends, last_email_send, expiration, attempts FROM verification_codes WHERE utln = $1',
    [utln],
  );

  // Get the number of email sends if an email has already been sent.
  let emailSends = 0;
  if (oldCodeResults.rowCount > 0) {
    const code = oldCodeResults.rows[0];
    emailSends = code.email_sends;

    // Check if the old verification code expried
    const expired = new Date(code.expiration).getTime() < new Date().getTime();
    const oldCodeExpired = expired || code.attempts >= 3;

    // If it has not expired AND we are not forcing a resend,
    // respond that the email has already been sent
    if (forceResend !== true && !oldCodeExpired) {
      logger.info(`Already sent code: ${code.code}`);
      return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT).data({
        email: code.email,
      });
    }
  }

  // Get the member info for the UTLN from Koh.
  const memberInfo = await authUtils.getMemberInfo(utln);

  //  If the member info is null (not found), error that it was not found.
  if (!memberInfo) {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND).noData();
  }

  // Ensure the member is a student
  if (!memberInfo.classYear) {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT).noData();
  }

  // Check that the student is in A&S or E
  if (!_.includes(['A&S', 'E'], memberInfo.college)) {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_UNDERGRAD).data({
      college: memberInfo.college,
      classYear: memberInfo.classYear,
    });
  }

  // Ensure user is in the Class of 2019
  if (memberInfo.classYear !== '19') {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_2019).data({
      classYear: memberInfo.classYear,
    });
  }

  // Code range is 000000 to 999999
  const verificationCode = Math.floor(Math.random() * (999999 + 1))
    .toString()
    .padStart(6, '000000');

  // Set an expiration date for the verification hash
  const now = new Date();
  const expirationDate = new Date(now.getTime() + 10 * 60000); // 10 minutes from now

  // Upsert the verification code into the database.
  await db.query(
    'INSERT INTO verification_codes (utln, code, expiration, attempts, email) VALUES($1, $2, $3, 0, $4) ON CONFLICT (utln) DO UPDATE SET (code, expiration, last_email_send, email_sends, attempts, email) = ($5, $6, now(), $7, 0, $8) RETURNING id',
    [
      utln,
      verificationCode,
      expirationDate,
      memberInfo.email,
      verificationCode,
      expirationDate,
      emailSends + 1,
      memberInfo.email,
    ],
  );

  // Create the verification url and send the email!
  // TODO: Enable sending emails again, ensure they work.
  mail.send({
    to: memberInfo.email,
    from: 'jumbosmash19@gmail.com',
    subject: 'JumboSmash Email Verification',
    html: `<p>Enter this code: ${verificationCode}</p>`,
  });

  slack.postVerificationCode(verificationCode, utln, memberInfo.email);

  // Send a success response to the client
  return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__SUCCESS).data({
    email: memberInfo.email,
  });
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return sendVerificationEmail(req.body.utln, req.body.forceResend);
  }),
];

module.exports = {
  handler,
  apply: sendVerificationEmail,
};
