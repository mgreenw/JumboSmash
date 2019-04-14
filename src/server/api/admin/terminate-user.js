// @flow

import type { $Request } from 'express';

const { status, asyncHandler, validate } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');
const slack = require('../../slack');

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
  const terminatedResults = await db.query(`
    WITH old AS (
      SELECT terminated FROM classmates WHERE id = $1
    ), updated AS (
      UPDATE classmates
      SET
        terminated = TRUE,
        termination_reason = CASE WHEN terminated THEN termination_reason ELSE $2 END
      WHERE id = $1
    )
    SELECT old.terminated AS "alreadyTerminated"
    FROM old
  `, [userId, reason]);

  if (terminatedResults.rowCount === 0) {
    return status(codes.TERMINATE_USER__USER_NOT_FOUND).noData();
  }

  // If the user's account is already terminated, alert the admin.
  const [{ alreadyTerminated }] = terminatedResults.rows;

  // Update to slack. Include if the user is already terminated.
  const addendum = alreadyTerminated ? '\nNote: The user was already terminated. Weird.' : '';
  slack.postAdminUpdate(adminUserId, adminUtln, `Terminated User ${userId}$\n${addendum}Reason: ${reason}`);

  if (alreadyTerminated) {
    return status(codes.TERMINATE_USER__ALREADY_TERMINATED).noData();
  }

  return status(codes.TERMINATE_USER__SUCCESS).noData();
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
