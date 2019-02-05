// @flow

import type { $Request } from 'express';

const apiUtils = require('../utils');
const { settingsSelectQuery } = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');

const selectSettings = settingsSelectQuery();

/**
 * @api {get} /api/users/me/settings
 *
 */
const getMySettings = async (userId: number) => {
  // try to get the user's settings from the users table
  const result = await db.query(`
    SELECT ${selectSettings}
    FROM users
    WHERE id = $1`, [userId]);

  // Can assume user exists and is in db b/c authenticated upstream
  return apiUtils.status(codes.GET_SETTINGS__SUCCESS).data(result.rows[0]);
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getMySettings(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: getMySettings,
};
