// @flow

const request = require('request');
const jwt = require('jsonwebtoken');
const config = require('config');

const db = require('../../../db');

function checkAuthenticated(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('secret'), async (err, decoded) => {
      if (err) return reject();
      try {
        const result = await db.query(
          'SELECT id, utln FROM users WHERE utln = $1 LIMIT 1',
          [decoded.utln],
        );

        // If no user exists, fail
        if (result.rowCount === 0) {
          const onboardingResult = await db.query(
            'SELECT id, utln FROM onboarding_users WHERE utln = $1 LIMIT 1',
            [decoded.utln],
          );

          if (onboardingResult.rowCount === 0) {
            return reject();
          }

          // If the user's id is undefined, they are onboarding
          return resolve({
            id: undefined,
            utln: decoded.utln,
          });
        }

        // Resolve with the user's id and utln!
        return resolve(result.rows[0]);
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

function cleanUtln(utln: string): string {
  return utln.trim().toLowerCase();
}

module.exports = {
  get,
  postForm,
  verificationCodeExpired,
  checkAuthenticated,
  cleanUtln,
};
