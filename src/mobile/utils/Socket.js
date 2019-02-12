/* eslint-disable */

import type { IO } from 'socket.io-client';

import { YellowBox } from 'react-native';
import io from 'socket.io-client';

import { SERVER_ROUTE } from '../api/routes';

// Ignore the annoying warning from the websocket connection options
// Not bad at all and no way around it for now
// https://stackoverflow.com/questions/53638667/unrecognized-websocket-connection-options-agent-permessagedeflate-pfx
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

class Socket {
  _socket: ?IO;

  constructor() {
    this._socket = null;
  }

  isConnected() {
    return this._socket !== null;
  }

  connect(token: string) {
    if (this.isConnected()) {
      this._socket.close();
    }
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
