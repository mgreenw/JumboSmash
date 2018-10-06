// @flow
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const request = require('request');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const db = require('../../db');

// Initialize the authentication router: /api/auth
const authRouter = express.Router();

authRouter.get('/verify/:hash', async (req, res) => {
  const { hash } = req.params;

  const result = await db.query(
    'UPDATE users SET verified = true WHERE verified = false AND verification_hash = $1 AND verification_expire_date > $2 RETURNING id',
    [hash, new Date()],
  );

  // Not verified - no rows were updated
  if (result.rows.length === 0) {
    return res.redirect('/not-verified');
  }

  // Success! Verified
  return res.redirect('/verified');
});

authRouter.post('/login', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, password FROM users WHERE email = $1 LIMIT 1',
      [req.body.email],
    );

    if (result.rows.length < 1) {
      return res.status(401).send({ error: 'Unknown username or password' });
    }
    const user = result.rows[0];

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 31540000, // expires in 24 hours
    });
    return res.status(200).send({ auth: true, token });
  } catch (err) {
    return res.status(500).send({ error: 'There was a problem logging in' });
  }
});

// TODO: Add to a utils function
/* eslint-disable arrow-body-style */
const postForm = (urlFormData) => {
  return new Promise((resolve, reject) => {
    request.post(urlFormData, (err, httpResponse, body) => {
      if (err) reject();
      resolve({ body, httpResponse });
    });
  });
};

const get = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (err, _, body) => {
      if (err) reject();
      resolve(body);
    });
  });
};

/* eslint-enable arrow-body-style */

authRouter.post('/register', async (req, res) => {

  try {
    const { utln } = req.body;

    // Check Tufts website for proper email
    const { httpResponse } = await postForm({ url: 'https://whitepages.tufts.edu/searchresults.cgi', form: { type: 'Students', search: utln } });
    const response = await get(`https://whitepages.tufts.edu/${httpResponse.headers.location}`);
    const year = response.split('<b>Class Year: </b>')[1].split('</td></div><td>')[1].split('</td></tr><tr><td>')[0].trim();

    if (year !== '19') {
      throw new Error('Could not register user: not in class of 2019');
    }

    const verificationHash = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    const expirationDate = new Date(now.getTime() + (10 * 60000)); // 10 minutes from now
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const result = await db.query(
      'INSERT INTO users(utln, password, verification_hash, verification_expire_date) VALUES($1, $2, $3, $4) RETURNING id',
      [utln, hashedPassword, verificationHash, expirationDate],
    );

    const verificationURL = `http://${req.get('host')}/api/auth/verify/${verificationHash}`;
    console.log(verificationURL);

    return res.status(200).send({ registered: true, expiration: expirationDate });
  } catch (err) {
    console.log(err);
    // TODO: Log this to a standard logger
    return res.status(500).send('There was a problem registering the user.');
  }
});

module.exports = authRouter;
