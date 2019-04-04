// @flow

import { YellowBox } from 'react-native';
import io from 'socket.io-client';
import newMessageAction from 'mobile/actions/app/notifications/newMessage';
import newMatchAction from 'mobile/actions/app/notifications/newMatch';
import readReceiptUpdateAction from 'mobile/actions/app/notifications/readReceiptUpdate';
import store from 'mobile/store';
import type { UserProfile, Message, Scene, ReadReceipt } from 'mobile/reducers';
import { SERVER_ROUTE } from 'mobile/api/routes';
import type { ServerMatch } from 'mobile/api/serverTypes';

// Ignore the annoying warning from the websocket connection options
// Not bad at all and no way around it for now
// https://stackoverflow.com/questions/53638667/unrecognized-websocket-connection-options-agent-permessagedeflate-pfx
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

let _socket = null;

function isConnected() {
  return _socket !== null;
}

function connect(token: string) {
  if (_socket !== null) {
    _socket.close();
  }

  // Connect the socket with the new token
  _socket = io(SERVER_ROUTE, {
    path: '/socket',
    transports: ['websocket', 'polling'],
    query: {
      token
    }
  });

  /* eslint-disable no-console */
  _socket.on('error', err => {
    console.log('Socket connection error.');
    console.log(err);
  });

  _socket.on('connect', () => {
    console.log('Socket connected to server.');
  });

  _socket.on('disconnect', () => {
    console.log('Socket disconnected from server.');
  });

  _socket.on(
    'NEW_MESSAGE',
    (data: {
      message: Message,
      senderProfile: UserProfile,
      senderUserId: number,
      previousMessageId: ?number
    }) => {
      const { message, senderProfile, senderUserId, previousMessageId } = data;
      // We have to ignore flow here because dispatch expects a normal action not a thunk. // TODO: correctly type thunks
      store.dispatch(
        // $FlowFixMe
        newMessageAction(
          message,
          senderProfile,
          senderUserId,
          previousMessageId
        )
      );
    }
  );

  _socket.on('NEW_MATCH', (data: { match: ServerMatch, scene: Scene }) => {
    const { match, scene } = data;

    // Ensure we type this function
    const newMatchThunk = newMatchAction(match, scene);

    // TODO: correctly type thunks
    // We have to ignore flow here because dispatch expects a normal action not a thunk.
    // $FlowFixMe
    store.dispatch(newMatchThunk);
  });

  _socket.on(
    'READ_RECEIPT_UPDATE',
    (data: { readerUserId: number, readReceipt: ?ReadReceipt }) => {
      const { readerUserId, readReceipt } = data;

      const readReceiptUpdateThunk = readReceiptUpdateAction(
        readerUserId,
        readReceipt
      );
      // TODO: See above
      // $FlowFixMe
      store.dispatch(readReceiptUpdateThunk);
    }
  );
  /* eslint-enable */
}

// Emit typing! That's all.
function typing(otherUserId: number) {
  if (_socket !== null) {
    _socket.emit('TYPING', otherUserId);
  }
}

function subscribeToTyping(userId: number, cb: () => void) {
  if (_socket !== null) {
    _socket.on('TYPING', data => {
      if (userId === data.userId) {
        cb();
      }
    });
  } else {
    console.log(
      'Cannot connect to socket for typing subscription: Socket is null'
    );
  }
}

function unsubscribeFromTyping() {
  if (_socket !== null) {
    // $FlowFixMe with no callback parameter it will cancel ALL typing listeners, which is what we want!
    _socket.off('TYPING');
  }
}

export default {
  isConnected,
  connect,
  typing,
  subscribeToTyping,
  unsubscribeFromTyping
};
