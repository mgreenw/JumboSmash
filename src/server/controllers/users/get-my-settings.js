// @flow

import type { $Request, $Response } from 'express';

const utils = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');

/**
 * @api {get} /api/users/me/settings
 *
 */
const getMySettings = async (req: $Request, res: $Response) => {
  // try to get the user's settings from the users table
  try {
    const result = await db.query(`
      SELECT
        want_he as "wantHe",
        want_she as "wantShe",
        want_they as "wantThey",
        use_he as "useHe",
        use_she as "useShe",
        use_they as "useThey"
      FROM users
      WHERE id = $1`, [req.user.id]);

    // Can assume user exists and is in db b/c authenticated upstream
    const settings = result.rows[0];
    return res.status(200).json({
      status: codes.GET_SETTINGS__SUCCESS,
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
  } catch (err) {
    return utils.error.server(res, err, 'Failed to get user settings.');
  }
};

module.exports = getMySettings;
