// @flow

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../db');
const authRouter = require('./auth');

const apiRouter = express.Router();
const isAuthenticated = (req, res, next) => {
  const { token } = req.body;
  jwt.verify(token, config.get('secret'), async (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Auth failure. Not logged in.' });
    try {
      const result = await db.query(
        'SELECT id from users where id = $1 LIMIT 1',
        [decoded.id],
      );
      if (result.rows.length === 0) {
        // No user. Fail.
        return res.status(401).send({ error: 'Auth failure. Not logged in' });
      }
    } catch (_) {
      return res.status(401).send({ error: 'Auth failure. Not logged in' });
    }

    // Successful Auth!
    return next();
  });
};

// The order here is important
apiRouter.use('/auth', authRouter);

// All authenticated endpoints must come after this next line
apiRouter.use(isAuthenticated);

module.exports = apiRouter;
