// @flow

import type { $Request } from 'express';

const _ = require('lodash');
const Sentry = require('@sentry/node');

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
    email: {
      description: "The user's Tufts email. Must be from the Class of 2019. May be first.last@tufts.edu or utln@tufs.edu",
      type: 'string',
      format: 'email',
    },
    forceResend: {
      description:
        'If true, then asks the server to resend the verification email, even if a code is still valid.',
      type: 'boolean',
    },
  },
  required: ['email'],
};
/* eslint-enable */

/**
 * @api {post} /api/auth/register
 *
 */

const sendVerificationEmail = async (email: string, forceResend: boolean) => {
  // If the email is the testers, email, return immediately
  // TODO: Comment this out when we don't need
  if (email === 'tester@jumbosmash.com' || email === 'tester2@jumbosmash.com') {
    const utln = email.split('@')[0];
    const expirationDate = new Date(new Date().getTime() + 10 * 60000);
    await db.query(`
      INSERT INTO verification_codes
      (utln, code, expiration, email)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (utln) DO UPDATE
      SET (code, expiration, email, attempts)
        = ($2, $3, $4, 0)
      RETURNING id
    `, [utln, '654321', expirationDate, email]);
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__SUCCESS).data({
      email,
      utln,
    });
  }

  const memberInfoResponse = await authUtils.getMemberInfo(email);
  let memberInfo = null;
  switch (memberInfoResponse.status) {
    case 'GET_MEMBER_INFO__SUCCESS':
      memberInfo = memberInfoResponse.member;
      break;
    case 'GET_MEMBER_INFO__NOT_FOUND':
      return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND).noData();
    case 'GET_MEMBER_INFO__NOT_TUFTS_EMAIL':
      return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__NOT_TUFTS_EMAIL).noData();
    default:
      throw new Error('Koh: No status found in result body.');
  }

  //  If the member info is null (not found), error that it was not found.
  if (!memberInfo) {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND).noData();
  }

  // NOTE: Ensuring a user is a "tester" went here. The `testers` table is now deprecated

  // Back to the regular functionality!
  const oldCodeResults = await db.query(`
    SELECT
      code,
      email,
      email_sends AS "emailSends",
      last_email_send AS "lastEmailSend",
      expiration,
      attempts
    FROM verification_codes WHERE utln = $1
  `, [memberInfo.utln]);

  // Get the number of email sends if an email has already been sent.
  let emailSends = 0;
  if (oldCodeResults.rowCount > 0) {
    const code = oldCodeResults.rows[0];
    /* eslint-disable-next-line prefer-destructuring */
    emailSends = code.emailSends;
    const {
      attempts,
      expiration,
      code: currentVerificationCode,
    } = code;

    // If the user has sent more than 3 emails, fail. This number gets reset when a user logs in.
    // They should contact us if they really can't get the code. This is really important
    // for security, otherwise user's could iterate this endpoint and try random codes
    // They should contact us at this point.
    if (emailSends > 3) {
      return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__TOO_MANY_EMAILS).noData();
    }

    if (emailSends > 2) {
      Sentry.withScope((scope) => {
        scope.setExtra('email', email);
        scope.setExtra('code', code);
        Sentry.captureException(new Error('More than two email sends for a single login cycle. This is unexected and should be investigated. This does not cause a SERVER_ERROR, but instead logs a warning so we can look into it.'));
      });
    }

    // Check if the old verification code expried
    const expired = new Date(expiration).getTime() < new Date().getTime();
    const oldCodeExpired = expired || attempts >= 3;

    // If it has not expired AND we are not forcing a resend,
    // respond that the email has already been sent
    if (forceResend !== true && !oldCodeExpired) {
      logger.debug(`Already sent code: ${currentVerificationCode}`);
      return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT).data({
        email: code.email,
        utln: memberInfo.utln,
      });
    }
  }

  // Ensure the member is a student
  if (!memberInfo.classYear) {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_STUDENT).noData();
  }

  // Check that the student is in A&S or E
  if (!_.includes(['A&S', 'E', 'SMFA AT TUFTS'], memberInfo.college)) {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_UNDERGRAD).data({
      college: memberInfo.college,
      classYear: memberInfo.classYear,
    });
  }

  // Ensure user is in the Class of 2019
  if (memberInfo.classYear !== '19') {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_2019).data({
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
      memberInfo.utln,
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
  mail.send({
    to: memberInfo.email,
    from: 'team@jumbosmash.com',
    subject: 'JumboSmash Verification Code',
    html: authUtils.generateVerificationEmail(verificationCode),
  });

  logger.debug(`Verification Code: ${verificationCode}`);
  await slack.postVerificationCode(verificationCode, memberInfo.utln, memberInfo.email);

  // Send a success response to the client
  return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__SUCCESS).data({
    email: memberInfo.email,
    utln: memberInfo.utln,
  });
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return sendVerificationEmail(req.body.email, req.body.forceResend);
  }),
];

module.exports = {
  handler,
  apply: sendVerificationEmail,
};
