// @flow

import type { $Request } from 'express';

const apiUtils = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');

/**
 * @api {get} /api/users/me/settings
 *
 */
const getMySettings = async (userId: number) => {
  // try to get the user's settings from the users table
  const result = await db.query(`
    SELECT
      want_he as "wantHe",
      want_she as "wantShe",
      want_they as "wantThey",
      use_he as "useHe",
      use_she as "useShe",
      use_they as "useThey"
    FROM users
    WHERE id = $1`, [userId]);

  // Can assume user exists and is in db b/c authenticated upstream
  const settings = result.rows[0];
  return apiUtils.status(codes.GET_SETTINGS__SUCCESS).data({
    settings: {
      usePronouns: {
        he: settings.useHe,
        she: settings.useShe,
        they: settings.useThey,
      },
      wantPronouns: {
        he: settings.wantHe,
        she: settings.wantShe,
        they: settings.wantThey,
      },
    },
  });
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
