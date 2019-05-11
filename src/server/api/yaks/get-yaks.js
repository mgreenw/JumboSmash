// @flow

import type { $Request } from 'express';

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');
const utils = require('./utils');

const yakSelect = utils.yakSelect('$1', {
  yakTableAlias: 'yaks',
  yakVotesTableAlias: 'yak_votes',
  buildJSON: false,
});

/**
 * @api {get} /api/yaks
 *
 */
const getYaks = async (userId: number) => {
  const yaks = (await db.query(`
    SELECT ${yakSelect}
    FROM yaks
    LEFT JOIN yak_votes ON yak_votes.yak_id = yaks.id
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
