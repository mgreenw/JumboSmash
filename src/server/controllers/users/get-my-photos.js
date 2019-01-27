// @flow

import type { $Request, $Response } from 'express';

const _ = require('lodash');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');

/**
 * @api {post} /api/users/me/photos
 *
 */
const getProfile = async (req: $Request, res: $Response) => {
  try {
    const result = await db.query(`
      SELECT id
      FROM photos
      WHERE user_id = $1
      ORDER BY index
    `, [req.user.id]);

    return res.status(200).json({
      status: codes.GET_MY_PHOTOS__SUCCESS,
      photos: _.map(result.rows, row => row.id),
    });
  // On error, return a server error.
  } catch (err) {
    return utils.error.server(res, err, 'Failed to get user profile.');
  }
};

module.exports = getProfile;
