// @flow

import type { $Request } from 'express';

const { status, asyncHandler } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');
const { classmateSelect } = require('./utils');

/**
 * @api {get} /admin/classmates
 *
 */
const getClassmates = async (adminUserId: number) => {
  const classmatesResult = await db.query(`
    SELECT ${classmateSelect}
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
