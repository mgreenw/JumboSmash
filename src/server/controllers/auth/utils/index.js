// @flow

const request = require('request');
const jwt = require('jsonwebtoken');
const config = require('config');

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
          SELECT u.id, p.user_id AS "profileUserId", u.utln, u.token_uuid AS "tokenUUID"
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

// Use Koh to get a member's info given a utln.
function getMemberInfo(utln: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Make the request to Koh.
    request(`${config.get('koh_host')}/api/member-info/${utln}`, (err, res, body) => {
      // If there is an error or no response, reject
      if (err) return reject(err);
      if (!res) return reject(new Error('No response from koh.'));

      // Parse the JSON from the response
      const bodyJson = JSON.parse(body);

      // Use the response's 'status' key to return the appropriate value. If
      // status is unexpected, reject.
      switch (bodyJson.status) {
        case 'GET_MEMBER_INFO__SUCCESS':
          return resolve(bodyJson.member);
        case 'GET_MEMBER_INFO__NOT_FOUND':
          return resolve(null);
        default:
          return reject(new Error('Koh: No status found in result body.'));
      }
    });
  });
}

function verificationCodeExpired(expiration: Date, attempts: number) {
  // Check the expiration date and the number of attempts on this code.
  const expired = new Date(expiration).getTime() < new Date().getTime();
  return expired || attempts >= 3;
}

module.exports = {
  getMemberInfo,
  verificationCodeExpired,
  getUser,
};
