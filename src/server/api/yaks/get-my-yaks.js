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
const getMyYaks = async (userId: number) => {
  const yaks = (await db.query(`
    SELECT ${yakSelect}
    FROM yaks
    LEFT JOIN yak_votes ON yak_votes.yak_id = yaks.id
    WHERE yaks.user_id = $1
    ORDER BY yaks.timestamp
  `, [userId])).rows;

  const yakPostAvailability = utils.getYakPostAvailability(yaks);

  return apiUtils.status(codes.GET_MY_YAKS__SUCCESS).data({
    yaks,
    yakPostAvailability,
  });
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
