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
        const result = await db.query(`
          SELECT u.id, u.utln, u.email, p.id AS profile, p.display_name, p.birthday, p.want_he, p.want_she, p.want_they, p.use_he, p.use_she, p.use_they, p.image1_url, p.image2_url, p.image3_url, p.image4_url, p.bio
          FROM users u
          LEFT JOIN profiles p ON p.user = u.id
          WHERE u.id = $1
          LIMIT 1`,
        [decoded.id]);

        // If no user exists, fail
        if (result.rowCount === 0) {
          return reject();
        }

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
  getUser,
  cleanUtln,
};
