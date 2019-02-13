// @flow

import { YellowBox } from 'react-native';
import io from 'socket.io-client';

import { SERVER_ROUTE } from '../api/routes';

// Ignore the annoying warning from the websocket connection options
// Not bad at all and no way around it for now
// https://stackoverflow.com/questions/53638667/unrecognized-websocket-connection-options-agent-permessagedeflate-pfx
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

let _socket = null;

export function isConnected() {
  return _socket !== null;
}

export function connect(token: string) {
  if (_socket !== null) {
    _socket.close();
  }

  // Connect the socket with the new token
  _socket = io(
    SERVER_ROUTE,
    {
      path: '/socket',
      transports: ['websocket', 'polling'],
      query: {
        token,
      },
    },
  );

  _socket.on('error', (err) => {
    console.log('Connection error.');
    console.log(err);
  });

  _socket.on('connect', () => {
    console.log('Connected to server.');
  });

  _socket.on('disconnect', () => {
    console.log('Disconnected from server.');
  });
}
