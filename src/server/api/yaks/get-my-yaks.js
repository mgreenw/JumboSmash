// @flow

import type { $Request } from 'express';

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');
const utils = require('./utils');

const yakSelect = utils.yakSelect('$1');

/**
 * @api {get} /api/yaks
 *
 */
const getMyYaks = async (userId: number) => {
  const yaks = (await db.query(`
    SELECT ${yakSelect}
    FROM yaks
    WHERE user_id = $1
    ORDER BY timestamp
  `, [userId])).rows;

  return apiUtils.status(codes.GET_MY_YAKS__SUCCESS).data({ yaks });
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getMyYaks(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: getMyYaks,
};
