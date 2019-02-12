// @flow

import type { Server } from 'express';

const initSocket = require('socket.io');
const redisAdapter = require('socket.io-redis');
const config = require('config');

const logger = require('../logger');

const namespace = '/socket';

let io = null;

function init(server: Server) {
  io = initSocket(server, {
    path: namespace,
    transports: ['websocket', 'polling'], // Only enable polling as a backup
  });
  io.adapter(redisAdapter(config.get('redis')));

  io.use((socket, next) => {
    const { token } = socket.handshake.query;
    logger.info(`TOKEN: ${token}`);
    next();
  });

  logger.info(`Socket listening at ${namespace}`);

  io.on('connection', (socket) => {
    logger.info('a user connected');

    socket.on('disconnect', () => {
      logger.info('a user disconnected');
    });
  });
}

module.exports = {
  init,
};
