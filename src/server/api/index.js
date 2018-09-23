const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../db');
const authRouter = require('./auth');

const apiRouter = express.Router();
const isAuthenticated = (req, res, next) => {
  const token = req.body.token;
  jwt.verify(token, config.get('secret'), async (err, decoded) => {
    if (err) return next(authFailure(socket));
    console.log('DECODED:', decoded);
    try {
      let result = await db.query(
        'SELECT id from users where id = $1 LIMIT 1',
        [decoded.id]
      );
      console.log('RESULT:', result.rows);
      if (result.rows.length === 0) {
        // No user. Fail.
        return next(authFailure(socket));
      }
    } catch (err) {
      return next(authFailure(socket));
    }
    console.log('successful auth!');
    return next();
  });

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.user.authenticated) {
    return next();
  }

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  return res.redirect('/');
}

apiRouter.use(isAuthenticated);
apiRouter.use('/auth', authRouter);


module.exports = apiRouter;
