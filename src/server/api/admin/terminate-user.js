// @flow

import type { $Request } from 'express';

const { status, asyncHandler, validate } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');
const slack = require('../../slack');
const { classmateSelect } = require('./utils');
const { constructAccountUpdate } = require('../users/utils');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "reason": {
      "type": "string",
      "minLength": 4,
      "maxLength": 500,
    },
  },
  "required": ["reason"]
};
/* eslint-enable */

/**
 * @api {post} /admin/classmates/:userId/terminate
 *
 */
const terminateUser = async (
  userId: number,
  reason: string,
  adminUserId: number,
  adminUtln: string,
) => {
  const terminationUpdate = constructAccountUpdate({
    type: 'ACCOUNT_TERMINATION',
    admin: {
      id: adminUserId,
      utln: adminUtln,
    },
    reason,
  });

  // Note: This does not update the termination_reason if the user is already terminated.
  const terminatedResults = await db.query(`
    UPDATE classmates
    SET
      terminated = TRUE,
      termination_reason = CASE WHEN terminated THEN termination_reason ELSE $3 END,
      account_updates = CASE WHEN terminated THEN account_updates ELSE account_updates || jsonb_build_array($4::jsonb) END
    WHERE id = $2
    RETURNING
      ${classmateSelect},
      (SELECT terminated FROM classmates WHERE id = $2) AS "alreadyTerminated"
  `, [adminUserId, userId, reason, terminationUpdate]);

  if (terminatedResults.rowCount === 0) {
    return status(codes.TERMINATE_USER__USER_NOT_FOUND).noData();
  }

  // If the user's account is already terminated, alert the admin.
  const [{ alreadyTerminated, ...classmate }] = terminatedResults.rows;

  // Update to slack. Include if the user is already terminated.
  const addendum = alreadyTerminated ? '\n*Note:* The user was already terminated. Weird.' : '';
  await slack.postAdminUpdate(adminUserId, adminUtln, 'Terminate User', [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Reason*: ${reason}${addendum}`,
      },
    },
  ], userId);

  // If already terminated, return that it wasn't normal...
  if (alreadyTerminated) {
    return status(codes.TERMINATE_USER__ALREADY_TERMINATED).data({
      classmate,
    });
  }

  // Return the classmate
  return status(codes.TERMINATE_USER__SUCCESS).data({
    classmate,
  });
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return terminateUser(req.params.userId, req.body.reason, req.user.id, req.user.utln);
  }),
];

module.exports = {
  handler,
  apply: terminateUser,
};
