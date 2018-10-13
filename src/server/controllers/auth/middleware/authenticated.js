// @flow

const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../../../db');
// Middleware to check if the user is authenticated
const authenticated = (req, res, next) => {
  const { token } = req.body;
  jwt.verify(token, config.get('secret'), async (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Auth failure. Not logged in.' });
    try {
      const result = await db.query(
        'SELECT id from users where id = $1 LIMIT 1',
        [decoded.id],
      );

      // No user. Fail.2
      if (result.rows.length === 0) {
        return res.status(401).send({ error: 'Auth failure. Not logged in' });
      }
    } catch (_) {
      return res.status(401).send({ error: 'Auth failure. Not logged in' });
    }

    // Successful Auth!
    return next();
  });
};

module.exports = authenticated;
