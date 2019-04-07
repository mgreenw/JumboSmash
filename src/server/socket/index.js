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
          // Ensure each user can only connect with one socket connection.
          // Because each user gets placed in a room by their user id, we can
          // just check to see if there are any clients in the room already. If
          // so, we do not allow a new client.
          this.io.in(user.id).clients((error, clients) => {
            if (error) {
              logger.error(`Failed to get clients connected to room ${user.id}`, error);
              return next(error);
            }

            // If there is already a client connected to this room, reject the new client.
            if (clients.length > 0) {
              logger.warn(`User ${user.id} tried to connect with multiple sockets at once.`);
              return next(new Error('Already a connected socket for the given client.'));
            }

            // All set! Allow the socket connection.
            socket.user = user;
            return next();
          });
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

  disconnect(userId: number) {
    return new Promise<void>((resolve, reject) => {
      // Do not do anything in a test env: socket is not setup here.
      if (NODE_ENV === 'test' || NODE_ENV === 'travis') {
        return resolve();
      }

      // Get a list of clients in the room with the user
      return this.io.in(userId).clients((getClientsErr, clients) => {
        if (getClientsErr) return reject(getClientsErr);

        // If there are no clients, resolve. This is not an error as the socket does
        // not need to be connected for the user to log out.
        if (clients.length === 0) {
          logger.debug(`Socket verified with userId ${userId} not found. No socket to disconnect.`);
          return resolve();
        }

        // Log a warning if there is more than one client in a room.
        if (clients.length > 1) {
          logger.warn(`There should only be one client in room ${userId} but there are ${clients.length}`);
        }

        // Disconnect the client from the socket.
        return this.io.sockets.adapter.remoteDisconnect(clients[0], true, (disconnectErr) => {
          if (disconnectErr) return reject(disconnectErr);
          return resolve();
        });
      });
    });
  }
}

const socket = new Socket();

module.exports = socket;
