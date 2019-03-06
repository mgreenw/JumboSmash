// @flow
/* eslint-disable no-underscore-dangle */

import type { Server } from 'express';
import type { SocketIO } from 'socket.io';

const initSocket = require('socket.io');
const redisAdapter = require('socket.io-redis');
const config = require('config');

const { UNAUTHORIZED, SERVER_ERROR } = require('../api/status-codes');
const logger = require('../logger');
const db = require('../db');
const { getUser, AuthenticationError } = require('../api/auth/utils');
const appUtils = require('../utils');
const { canAccessUserData } = require('../api/utils');

const NODE_ENV = appUtils.getNodeEnv();

const namespace = '/socket';
const READ_MESSAGE = 'READ_MESSAGE';

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
      transports: ['websocket'], // Don't use polling - it requires sticky sessions and is old
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

      socket.on(READ_MESSAGE, async (otherUserId: number) => {
        const hasAccess = await canAccessUserData(otherUserId, socket.user.id, {
          requireMatch: true,
        });

        // If there is access, update the db and notify the other user
        if (hasAccess) {
          const now = new Date();
          await db.query(`
            UPDATE relationships
            SET critic_message_read_timestamp = $1
            WHERE
              critic_user_id = $2
              AND candidate_user_id = $3
          `, [now, socket.user.id, otherUserId]);

          this.notify(otherUserId, READ_MESSAGE, {
            userId: socket.user.id,
            messageReadTimestamp: now,
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
      logger.warn('Cannot notify in a testing environment!');
      return;
    }

    try {
      this.io.to(userId.toString()).emit(event, data);
      logger.info(`Sent ${event} to userId ${userId} : ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      logger.warn('Failed to send update to user', error);
    }
  }
}

const socket = new Socket();

module.exports = socket;