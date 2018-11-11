// @flow

import type { $Request, $Response } from 'express';

const utils = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {},
  "required": []
};
/* eslint-enable */

/**
 * @api {get} /api/users/me/settings
 *
 */
const getMySettings = async (req: $Request, res: $Response) => {
  // try to get the user's settings from the users table
  try {
    const result = await db.query(`
      SELECT
        wants_he as "wantsHe",
        wants_she as "wantsShe",
        wants_they as "wantsThey",
        uses_he as "usesHe",
        uses_she as "usesShe",
        uses_they as "usesThey"
      FROM users
      WHERE id = $1`, [req.user.id]);

    // Can assume the user exists and is in db b/c authenticated upstream
    const settings = result.rows[0];
    return res.status(200).json({
      status: codes.GET_SETTINGS__SUCCESS,
      settings,
    });
  } catch (error) {
    return utils.error.server(res, 'Failed to get user settings.');
  }
};

module.exports = [utils.validate(schema), getMySettings];
