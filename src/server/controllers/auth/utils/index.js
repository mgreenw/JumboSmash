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
          SELECT u.id, p.id AS profileId, u.utln
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

/* eslint-disable arrow-body-style */
function postForm(urlFormData: Object): Promise<any> {
  return new Promise((resolve, reject) => {
    request.post(urlFormData, (err, httpResponse, body) => {
      if (err) reject();
      resolve({ body, httpResponse });
    });
  });
}

function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request(url, (err, _, body) => {
      if (err) reject();
      resolve(body);
    });
  });
}
/* eslint-enable arrow-body-style */

function verificationCodeExpired(expiration: Date, attempts: number) {
  // Check the expiration date and the number of attempts on this code.
  const expired = new Date(expiration).getTime() < new Date().getTime();
  return expired || attempts >= 3;
}

module.exports = {
  get,
  postForm,
  verificationCodeExpired,
  getUser,
};
