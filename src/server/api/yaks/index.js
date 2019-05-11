// @flow

const express = require('express');
const getYaks = require('./get-yaks');
<<<<<<< HEAD
const postYak = require('./post-yak');
const voteOnYak = require('./vote-on-yak');
=======
>>>>>>> master

const yaksRouter = express.Router();

yaksRouter.get('/', getYaks.handler);
<<<<<<< HEAD
yaksRouter.post('/', postYak.handler);
yaksRouter.patch('/:yakId(\\d+$)', voteOnYak.handler);
=======
>>>>>>> master

module.exports = yaksRouter;
