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
  if (email === 'tester@jumbosmash.com') {
    const utln = 'tester';
    const expirationDate = new Date(new Date().getTime() + 10 * 60000);
    await db.query(`
      INSERT INTO verification_codes
      (utln, code, expiration, email)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (utln) DO UPDATE
      SET (code, expiration, email)
        = ($2, $3, $4)
      RETURNING id
    `, [utln, '654321', expirationDate, email]);
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__SUCCESS).data({
      email,
      utln: 'tester',
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

  // Beta-specific code. Should be removed or put behind a beta flag in the future
  const testerResults = await db.query(`
    SELECT id
    FROM testers
    WHERE utln = $1
  `, [memberInfo.utln]);

  // Don't allow not-tester users
  if (testerResults.rowCount === 0) {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND).noData();
  }

  // Back to the regular functionality!
  const oldCodeResults = await db.query(
    'SELECT code, email, email_sends, last_email_send, expiration, attempts FROM verification_codes WHERE utln = $1',
    [memberInfo.utln],
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
        utln: memberInfo.utln,
      });
    }
  }

  // Ensure the member is a student
  if (!memberInfo.classYear) {
    return apiUtils.status(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_STUDENT).noData();
  }

  // Check that the student is in A&S or E
  if (!_.includes(['A&S', 'E'], memberInfo.college)) {
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
    from: 'beta@jumbosmash.com',
    subject: 'JumboSmash Verification Code',
    html: authUtils.generateVerificationEmail(verificationCode),
  });

  logger.debug(`Verification Code: ${verificationCode}`);
  slack.postVerificationCode(verificationCode, memberInfo.utln, memberInfo.email);

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
