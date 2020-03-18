// @flow

import type { $Request } from 'express';

const { status, asyncHandler } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');
const { classmateSelect } = require('./utils');

/**
 * @api {get} /admin/classmates/:id
 *
 */
const getClassmates = async (classmateId: number, adminUserId: number) => {
  const classmateResult = await db.query(`
    SELECT
      ${classmateSelect},
      account_updates AS "accountUpdates"
    FROM classmates
    WHERE id = $2
  `, [adminUserId, classmateId]);

  if (classmateResult.rowCount === 0) {
    return status(codes.GET_CLASSMATE__NOT_FOUND).noData();
  }

  return status(codes.GET_CLASSMATE__SUCCESS).data({
    classmate: classmateResult.rows[0],
  });
};

const handler = [
  asyncHandler(async (req: $Request) => {
    return getClassmates(req.params.id, req.user.id);
  }),
];

module.exports = {
  handler,
  apply: getClassmates,
};
