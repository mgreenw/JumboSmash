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

      socket.on(READ_MESSAGE, async (senderUserId: number, messageId: number) => {
        const now = new Date();
        const hasAccess = await canAccessUserData(senderUserId, socket.user.id, {
          requireMatch: true,
        });

        // If there is access, update the db and notify the other user
        if (!hasAccess) return;

        const client = await db.connect();
        try {
          await client.query('BEGIN');

          const messageResult = await client.query(`
            SELECT timestamp
            FROM messages
            WHERE
              id = $1
              AND sender_user_id = $2
              AND receiver_user_id = $3
          `, [messageId, senderUserId, socket.user.id]);

          if (messageResult.rowCount === 0) return;
          const [{ timestamp: newTimestamp }] = messageResult.rows;

          const previousMessageResult = await client.query(`
            SELECT critic_read_message_id AS "criticReadMessageId"
            FROM relationships
            WHERE
              critic_user_id = $1
              AND candidate_user_id = $2
          `, [socket.user.id, senderUserId]);

          // If there is a previous message, ensure that the new message
          // is after the old message
          if (previousMessageResult.rowCount > 0) {
            const [{ criticReadMessageId }] = previousMessageResult.rows;

            if (criticReadMessageId === messageId) {
              logger.debug('Cannot read the same message twice.');
              return;
            }

            const previousTimestampResult = await client.query(`
              SELECT timestamp
              FROM messages
              WHERE id = $1
            `, [criticReadMessageId]);

            if (previousTimestampResult.rowCount > 0) {
              const [{ timestamp: previousTimestamp }] = previousTimestampResult.rows;
              if (previousTimestamp > newTimestamp) {
                logger.debug('Cannot read a message that is before an already read message.');
                return;
              }
            }
          }

          await client.query(`
            UPDATE relationships
            SET
              critic_read_message_timestamp = $1,
              critic_read_message_id = $2
            WHERE
              critic_user_id = $3
              AND candidate_user_id = $4
          `, [now, messageId, socket.user.id, senderUserId]);

          await client.query('COMMIT');

          this.notify(senderUserId, READ_MESSAGE, {
            userId: socket.user.id,
            readReceipt: {
              timestamp: now,
              messageId,
            },
          });
          logger.debug(`Successfully read message ${messageId}`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
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
