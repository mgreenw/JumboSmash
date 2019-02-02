// @flow

import type { $Request } from 'express';

const _ = require('lodash');

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/users/me/photos
 *
 */
const getMyPhotos = async (userId: number) => {
  const result = await db.query(`
    SELECT id
    FROM photos
    WHERE user_id = $1
    ORDER BY index
  `, [userId]);

  return apiUtils.status(codes.GET_MY_PHOTOS__SUCCESS).data({
    photoIds: _.map(result.rows, row => row.id),
  });
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getMyPhotos(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: getMyPhotos,
};
