// @flow

import type { $Request } from 'express';

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/yaks
 *
 */
const getYaks = async (userId: number) => {
  const yaks = (await db.query(`
    SELECT
      id,
      score,
      content,
      timestamp,
      user_id = $1 AS "fromClient"
    FROM yaks
    WHERE timestamp > NOW() - INTERVAL '24 HOURS'
    ORDER BY timestamp
  `, [userId])).rows;

  return apiUtils.status(codes.GET_YAKS__SUCCESS).data({
    yaks,
  });
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getYaks(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: getYaks,
};
