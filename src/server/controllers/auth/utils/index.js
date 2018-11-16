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
          SELECT u.id, p.id AS "profileId", u.utln
          FROM users u
          LEFT JOIN profiles p ON p.user_id = u.id
          WHERE u.id = $1
          LIMIT 1`,
          [decoded.id],
        );

        // If no user exists with that id, fail
        if (result.rowCount === 0) {
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

function getMemberInfo(utln: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request(`${config.get('koh_host')}/api/member-info/${utln}`, (err, res, body) => {
      if (err) return reject(err);
      if (!res) return reject(new Error('No response from koh.'));
      const bodyJson = JSON.parse(body);
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
