// @flow

import type { $Request } from 'express';

const { status, asyncHandler } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');


/**
 * @api {get} /admin/classmates
 *
 */
const getClassmates = async (adminUserId: number) => {
  const classmatesResult = await db.query(`
    SELECT
      id,
      utln,
      email,
      terminated AS "isTerminated",
      json_build_object(
        'smash', active_smash,
        'social', active_social,
        'stone', active_stone
      ) AS "activeScenes",
      admin_password IS NOT NULL AS "isAdmin",
      COALESCE((SELECT blocked FROM relationships WHERE critic_user_id = id AND candidate_user_id = $1), false) AS "blockedRequestingAdmin"
    FROM classmates
  `, [adminUserId]);
  return status(codes.GET_CLASSMATES__SUCCESS).data({
    classmates: classmatesResult.rows,
  });
};

const handler = [
  asyncHandler(async (req: $Request) => {
    return getClassmates(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: getClassmates,
};
