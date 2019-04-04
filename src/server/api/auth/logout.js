// @flow

import type { $Request } from 'express';

const { promisify } = require('util');
const db = require('../../db');
const codes = require('../status-codes');
const apiUtils = require('../utils');
const socket = require('../../socket');
const logger = require('../../logger');

// const clients = (io)

/**
 * @api {post} /api/auth/logout/
 * Log a user out. Delete their auth and push tokens.
 */
const logout = async (userId: number) => {
  // await db.query(`
  //   UPDATE classmates
  //   SET
  //     token_uuid = NULL,
  //     expo_push_token = NULL
  //   WHERE id = $1
  // `, [userId]);

  socket.disconnect(userId);
  return apiUtils.status(codes.GET_CONVERSATION__SUCCESS).noData();
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return logout(req.user.id);
  }),
];

module.exports = {
  apply: logout,
  handler,
};
