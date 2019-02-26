// @flow

import type { Server } from 'express';

const initSocket = require('socket.io');
const redisAdapter = require('socket.io-redis');
const config = require('config');

const { UNAUTHORIZED } = require('../api/status-codes');
const logger = require('../logger');
const { getUser } = require('../api/auth/utils');

const namespace = '/socket';

let io = null;

function init(server: Server) {
  io = initSocket(server, {
    path: namespace,
    transports: ['websocket', 'polling'], // Only enable polling as a backup
  });
  io.adapter(redisAdapter(config.get('redis')));

  /* eslint-disable no-param-reassign */
  io.use(async (socket, next) => {
    Promise.resolve(getUser(socket.handshake.query.token))
      .then((user) => {
        socket.user = user;
        next();
      })
      .catch(() => {
        // A caught error from getUser means the token is invalid.
        next(new Error(UNAUTHORIZED.status));
      });
  });
  /* eslint-enable no-param-reassign */

  logger.info(`Socket listening at ${namespace}`);

  io.on('connection', (socket) => {
    logger.info(`Connection via socket: ${JSON.stringify(socket.user, null, 2)}`);

    socket.join(socket.user.id, (err) => {
      if (err) {
        logger.error('Socket failed to join room', err);
      }
    });

    socket.on('error', (err) => {
      logger.error('Socket Error', err);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.user.id}`);
    });
  });
}

module.exports = {
  init,
};
