// @flow

import type { $Request } from 'express';

const db = require('../../db');
const redis = require('../../redis');
const apiUtils = require('../utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/yaks
 *
 */
const getYaks = async () => {
  return apiUtils.status(codes.GET_YAKS__SUCCESS).data({
    yaks: [],
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
