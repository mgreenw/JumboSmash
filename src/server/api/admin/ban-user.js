// @flow

import type { $Request } from 'express';

const { status, asyncHandler, validate } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "reason": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500,
    },
  },
  "required": ["reason"]
};
/* eslint-enable */

/**
 * @api {post} /admin/ban/:userId
 *
 */
const banUser = async (userId: number, reason: string) => {
  const banResult = await db.query(`
    UPDATE classmates new
    SET
      banned = TRUE,
      banned_reason = CASE WHEN banned THEN banned ELSE $1 END
    FROM classmates old
    WHERE id = $2
    RETURNING old.banned AS "alreadyBanned"
  `, [reason, userId]);

  if (banResult.rowCount === 0) {
    return status(codes.BAN_USER__USER_NOT_FOUND).noData();
  }

  // If the user is already banned, alert the admin.
  const [{ alreadyBanned }] = banResult.rows;
  if (alreadyBanned) {
    return status(codes.BAN_USER__ALREADY_BANNED).noData();
  }

  return status(codes.BAN_USER__SUCCESS).noData();
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return banUser(req.params.userId, req.body.reason);
  }),
];

module.exports = {
  handler,
  apply: banUser,
};
