// @flow

import type { $Request } from 'express';

const slack = require('../../slack');
const db = require('../../db');
const { REPORT_USER__SUCCESS, REPORT_USER__NOT_FOUND } = require('../status-codes');
const { asyncHandler, status, validate } = require('../utils');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "userId": {
      "description": "The user to report",
      "type": "number",
      "multipleOf": 1 // This asserts that the javascript number is an integer
    },
    "message": {
      "description": "The description of why the user was blocked.",
      "type": "string",
    }
  },
  "required": ["userId", "message"]
};
/* eslint-enable */

/**
 * @api {post} /api/meta/report
 *
 */
const reportUser = async (
  reportingUserId: number,
  reportedUserId: number,
  message: string,
) => {
  const reportedUserResult = await db.query(`
    SELECT utln, email
    FROM classmates
    WHERE id = $1
  `, [reportedUserId]);

  if (reportedUserResult.rowCount === 0) {
    return status(REPORT_USER__NOT_FOUND).noData();
  }

  const [{ email, utln }] = reportedUserResult.rows;

  // We add some context to the message body
  const revisedMessage = `
Reported User Email: ${email}
Reported User UTLN: ${utln}
Message:
${message}`;

  // Post the message and return
  slack.postReport(reportingUserId, reportedUserId, revisedMessage);
  return status(REPORT_USER__SUCCESS).noData();
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return reportUser(
      req.user.id,
      req.body.userId,
      req.body.message,
    );
  }),
];

module.exports = {
  handler,
  apply: reportUser,
};
