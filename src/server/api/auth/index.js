const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
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

authRouter.post('/register', async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  try {
    const result = await db.query(
      'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING id',
      [req.body.firstName, req.body.lastName, req.body.email, hashedPassword]
    );

    const token = jwt.sign({ id: result.rows[0].id }, config.get('secret'), {
      expiresIn: 86400, // expires in 24 hours
    });
    res.status(200).send({ auth: true, token });
  } catch (err) {
    console.log(err);
    return res.status(500).send('There was a problem registering the user.');
  }
});

module.exports = authRouter;
