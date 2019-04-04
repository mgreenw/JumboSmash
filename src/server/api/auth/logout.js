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

  if (socket.io) {
    // console.log(socket.io.adapter().client);
    socket.io.of('/socket').adapter.clients((err, clients) => {
      console.log(err, clients);
    });
    // console.log(socket.io);
    // const clients = await promisify(socket.io.clients)();
  } else {
    logger.warn('Tried to kill user socket connection on logout but could not get initialized socket');
  }
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
