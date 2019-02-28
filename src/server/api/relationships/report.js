// @flow

import type { $Request } from 'express';

const slack = require('../../slack');
const { REPORT__SUCCESS, REPORT__USER_NOT_FOUND } = require('../status-codes');
const db = require('../../db');
const { asyncHandler, status, validate } = require('../utils');


/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "userId": {
      "description": "The id of the user to block",
      "type": "number",
      "multipleOf": 1 // This asserts that the javascript number is an integer
    },
    "message": {
      "type": "string",
      "description": "The message sent by the reporting user about the reported user"
    },
    "reasonCode": {
      "type": "string",
      "description": "The standardized reason for reporting the user",
      "maxLength": 100
    },
    "block": {
      "type": "boolean",
      "description": "Whether to block the reported user or not"
    }
  },
  "required": ["userId", "message", "reasonCode", "block"]
};
/* eslint-enable */

/**
 * @api {post} /api/relationships/report
 *
 */
const report = async (
  reportingUserId: number,
  reportedUserId: number,
  message: string,
  reasonCode: string,
  block: boolean,
) => {
  // NOTES:
  // 1) This query will fail if the user does not exist. We handle
  //    this specific error in the "catch" block
  // 2) If there is currently no relationship between the two users, a
  //    relationship will be inserted. If there is a relationship, the
  //    relationship will be updated with the desired values
  // 3) The 'last_swipe_timestamp' is always updated to reflect that the
  //    critic has interacted with the candidate
  const reportedUserResult = await db.query(`
    SELECT utln, email
    FROM classmates
    WHERE id = $1
  `, [reportedUserId]);

  if (reportedUserResult.rowCount === 0) {
    return status(REPORT__USER_NOT_FOUND).noData();
  }

  const [{ email, utln }] = reportedUserResult.rows;

  // We add some context to the message body
  const revisedMessage = `
Reported User Email: ${email}
Reported User UTLN: ${utln}
Reason Code: ${reasonCode}
Message:
${message}`;

  // Post the message and return
  slack.postReport(reportingUserId, reportedUserId, revisedMessage);

  if (block) {
    await db.query(`
    INSERT INTO relationships
      (critic_user_id, candidate_user_id, blocked)
      VALUES ($1, $2, true)
    ON CONFLICT (critic_user_id, candidate_user_id)
    DO UPDATE
      SET
      blocked = true,
      last_swipe_timestamp = now()
  `, [reportingUserId, reportedUserId]);
  }

  return status(REPORT__SUCCESS).noData();
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return report(
      req.user.id,
      req.body.userId,
      req.body.message,
      req.body.reasonCode,
      req.body.block,
    );
  }),
];

module.exports = {
  handler,
  apply: report,
};
