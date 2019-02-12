// @flow

import type { IO } from 'socket.io-client';

import io from 'socket.io-client';

import { SERVER_ROUTE } from '../api/routes';

class Socket {
  _socket: ?IO;

  constructor() {
    this._socket = null;
  }

  isInitialized() {
    return this._socket !== null;
  }

  connect(token: string) {
    this._socket = io(
      SERVER_ROUTE,
      {
        path: '/socket',
        transports: ['websocket', 'polling'],
        query: {
          token,
        },
      },
    );

    this._socket.on('error', (err) => {
      console.log('Connection error.');
      console.log(err);
    });

    this._socket.on('connect', () => {
      console.log('Connected to server.');
    });

    this._socket.on('disconnect', () => {
      console.log('Disconnected from server.');
    });
  }
}

const socket = new Socket();

export default socket;
