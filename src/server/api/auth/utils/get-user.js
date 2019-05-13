// @flow

const config = require('config');
const jwt = require('jsonwebtoken');

const db = require('../../../db');
const logger = require('../../../logger');

const AuthenticationError = require('./authentication-error');

function getUser(token: string, adminPassword: ?string = null): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('secret'), async (err, decoded) => {
      if (err) {
        return reject(
          new AuthenticationError('Invalid secret used in decoding'),
        );
      }
      try {
        // Get the user from the users table. If the user has a profile setup,
        // join with that profile. If not, the 'profile' field will be null
        const result = await db.query(
          `
          SELECT
            u.id,
            COALESCE(p.user_id, 0)::boolean AS "hasProfile",
            p.birthday AS birthday,
            u.utln,
            u.token_uuid AS "tokenUUID",
            u.expo_push_token AS "expoPushToken",
            (u.admin_password IS NOT NULL AND u.admin_password = $1) AS "isAdmin",
            u.terminated AS "terminated",
            u.termination_reason AS "terminationReason",
            u.can_be_active_in_scenes AS "canBeActiveInScenes"
          FROM classmates u
          LEFT JOIN profiles p ON p.user_id = u.id
          WHERE u.id = $2
          LIMIT 1`,
          [adminPassword, decoded.userId],
        );

        // If no user exists with that id, fail
        if (result.rowCount === 0) {
          return reject(new AuthenticationError('User does not exist'));
        }

        const {
          tokenUUID,
          terminated,
          terminationReason,
          ...user
        } = result.rows[0];

        // Check if the user's token's uuid is valid
        if (tokenUUID === null || decoded.uuid !== tokenUUID || terminated) {
          return reject(
            new AuthenticationError(
              'User token invalid',
              terminated,
              terminationReason,
            ),
          );
        }
        // If a user exists, return the user!
        return resolve(user);

        // If there is an unknown error, reject
      } catch (error) {
        logger.error('Server Error: Failed to verify user.', error);
        return reject(error);
      }
    });
  });
}

module.exports = getUser;
