// @flow
/* eslint-disable no-underscore-dangle */

import type { Server } from 'express';
import type { SocketIO } from 'socket.io';

const initSocket = require('socket.io');
const redisAdapter = require('socket.io-redis');
const config = require('config');

const { UNAUTHORIZED, SERVER_ERROR } = require('../api/status-codes');
const logger = require('../logger');
const { getUser, AuthenticationError } = require('../api/auth/utils');
const appUtils = require('../utils');
const { canAccessUserData } = require('../api/utils');

const NODE_ENV = appUtils.getNodeEnv();

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
        .catch((error) => {
          // A caught error from getUser means the token is invalid.
          if (error instanceof AuthenticationError) {
            return next(new Error(UNAUTHORIZED.status));
          }

          logger.error('Error authenticating user', error);
          return next(new Error(SERVER_ERROR.status));
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

      socket.on('TYPING', async (otherUserId: number) => {
        // NOTE: Admins don't get special privileges here
        const hasAccess = await canAccessUserData(otherUserId, socket.user.id, {
          requireMatch: true,
        });
        if (hasAccess) {
          this.notify(otherUserId, 'TYPING', {
            userId: socket.user.id,
          });
        }
      });
    });

    this._io = _io;
  }

  notify(userId: number, event: string, data: Object) {
    // The tests do not start at server.js which is required
    // to initialize the server. Therefore, we cannot use the
    // socket's notify method in tests.
    if (NODE_ENV === 'test' || NODE_ENV === 'travis') {
      logger.info('Cannot notify in a testing environment!');
      return;
    }

    try {
      this.io.to(userId.toString()).emit(event, data);
      logger.debug(`Sent ${event} to userId ${userId} : ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      logger.warn('Failed to send update to user', error);
    }
  }
}

const socket = new Socket();

module.exports = socket;
