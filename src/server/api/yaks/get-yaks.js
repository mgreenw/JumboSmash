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

const MIN_SCORE = -5;

/**
 * @api {get} /api/yaks
 *
 */
const getYaks = async (userId: number) => {
  const yaks = (await db.query(`
    SELECT ${yakSelect}
    FROM yaks
    LEFT JOIN yak_votes
      ON yak_votes.yak_id = yaks.id
      AND yak_votes.user_id = $1
    WHERE
      timestamp > NOW() - INTERVAL '24 HOURS'
      AND score >= $2
    ORDER BY timestamp
  `, [userId, MIN_SCORE])).rows;

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
