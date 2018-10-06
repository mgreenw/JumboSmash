const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const request = require('request');
const db = require('../../db');

const authRouter = express.Router();

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
    console.log('login ID:', user.id);

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // expires in 24 hours
    });
    return res.status(200).send({ auth: true, token });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'There was a problem logging in' });
  }
});

const post = (urlFormData) => {
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

authRouter.post('/register', async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  try {
    // Check Tufts website for proper email
    console.log(req.body.utln);
    const { httpResponse } = await post({ url: 'https://whitepages.tufts.edu/searchresults.cgi', form: { type: 'Students', search: req.body.utln } });
    const response = await get(`https://whitepages.tufts.edu/${httpResponse.headers.location}`);
    const year = response.split('<b>Class Year: </b>')[1].split('</td></div><td>')[1].split('</td></tr><tr><td>')[0].trim();
    console.log(year);
    if (year !== '19') {
      throw new Error('Could not register user: not in class of 2019');
    }
    // const result = await db.query(
    //   'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING id',
    //   [req.body.firstName, req.body.lastName, req.body.email, hashedPassword]
    // );

    const token = 'test';/* jwt.sign({ id: result.rows[0].id }, config.get('secret'), {
      expiresIn: 86400, // expires in 24 hours
    });*/
    return res.status(200).send({ auth: true, token });
  } catch (err) {
    console.log(err);
    return res.status(500).send('There was a problem registering the user.');
  }
});

module.exports = authRouter;
