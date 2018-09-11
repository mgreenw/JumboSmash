// @flow
import db from '../db';
import { subscribe, unsubscribe } from '../publications';
import config from 'config';
import { call } from '../actions';
var jwt = require('jsonwebtoken');

// $FlowFixMe: Need to get http server type?
function makeIo(http) {
  let io = require('socket.io')(http, {
    path: '/api'
  });
  initializeIo(io);
  return io;
}

const sockets = {};

function initializeIo(io) {
  io.on('connection', async function(socket) {
    console.log('a user connected', socket.id);
    
  });
}

module.exports = {
  init: makeIo
};
