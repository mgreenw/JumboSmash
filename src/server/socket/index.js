// @flow

import type { Server } from 'express';
import type { SocketIO } from 'socket.io';

const initSocket = require('socket.io');
const redisAdapter = require('socket.io-redis');
const config = require('config');

const { UNAUTHORIZED } = require('../api/status-codes');
const logger = require('../logger');
const { getUser } = require('../api/auth/utils');

const namespace = '/socket';

class Socket {
  _io: ?SocketIO;
  constructor() {
    this._io = null;
  }

  get io() : SocketIO {
    if (this._io !== null) {
      return this._io;
    }
    throw new Error('Oops! socket is not yet initialized.');
  }

  init(server: Server) {

    const _io = initSocket(server, {
      path: namespace,
      transports: ['websocket', 'polling'], // Only enable polling as a backup
    });
    _io.adapter(redisAdapter(config.get('redis')));

    /* eslint-disable no-param-reassign */
    _io.use(async (socket, next) => {
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

    _io.on('connection', (socket) => {
      logger.info(`Connection via socket: ${JSON.stringify(socket.user, null, 2)}`);

      socket.join(socket.user.id.toString(), (err) => {
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

    this._io = _io;
  }

  _notify(userId: number, event: string, data: Object) {
    try {
      this.io.to(userId.toString()).emit(event, data);
      logger.info(`Sent ${event} to userId ${userId} : ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      logger.warn('Failed to send update to user', error);
    }
  }

  sendNewMessageNotification(userId: number, message: Object) {
    this._notify(userId, 'NEW_MESSAGE', message);
  }

  sendNewMatchNotification(userId: number, match: Object) {
    this._notify(userId, 'NEW_MATCH', match);
  }
}

const socket = new Socket();

module.exports = socket;
