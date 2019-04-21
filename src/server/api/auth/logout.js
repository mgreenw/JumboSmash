// @flow

import type { $Request } from 'express';

const Sentry = require('@sentry/node');
const db = require('../../db');
const codes = require('../status-codes');
const apiUtils = require('../utils');
const socket = require('../../socket');
const logger = require('../../logger');

/**
 * @api {post} /api/auth/logout/
 * Log a user out. Delete their auth and push tokens.
 */
const logout = async (userId: number) => {
  const logoutResult = await db.query(`
    UPDATE classmates
    SET
      token_uuid = NULL,
      expo_push_token = NULL
    WHERE id = $1
    RETURNING utln
  `, [userId]);
  const [{ utln }] = logoutResult.rows;

  if (!utln) {
    throw new Error(`Expected to log out a user with id ${userId} but failed to find user with that id.`);
  }

  try {
    await socket.disconnect(userId);
  } catch (error) {
    Sentry.captureException(error);
    logger.error('Failed to disconnect user socket connection', error);
  }

  logger.info(`${utln} logged out.`);
  return apiUtils.status(codes.LOGOUT__SUCCESS).noData();
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
