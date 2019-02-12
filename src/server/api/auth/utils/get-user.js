// @flow

const config = require('config');
const jwt = require('jsonwebtoken');

const db = require('../../../db');

function getUser(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('secret'), async (err, decoded) => {
      if (err) return reject();
      try {
        // Get the user from the users table. If the user has a profile setup,
        // join with that profile. If not, the 'profile' field will be null
        const result = await db.query(
          `
          SELECT u.id, COALESCE(p.user_id, 0)::boolean AS "hasProfile", u.utln, u.token_uuid AS "tokenUUID"
          FROM users u
          LEFT JOIN profiles p ON p.user_id = u.id
          WHERE u.id = $1
          LIMIT 1`,
          [decoded.userId],
        );

        // If no user exists with that id, fail
        if (result.rowCount === 0) {
          return reject();
        }

        // Check if the user's token's uuid is valid
        const user = result.rows[0];
        if (user.tokenUUID === null || decoded.uuid !== user.tokenUUID) {
          return reject();
        }

        // If a user exists, return the user!
        return resolve(result.rows[0]);

        // If there is an unknown error, reject
      } catch (error) {
        return reject();
      }
    });
  });
}

module.exports = getUser;
