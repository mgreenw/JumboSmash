// @flow

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from 'config';
import bodyParser from 'body-parser';
import httpModule from 'http';

import db from './db';

const app = express();

// $FlowFixMe: Not sure why this is causing a bug
var http = httpModule.Server(app);
global.app = app;
global.http = http;

http.listen(8080, function() {
  console.log('Socket.io listening on *:8080');
});

const sockets = require('./sockets');
sockets.init(http);

let authRouter = express.Router();
authRouter.use(bodyParser.json());

authRouter.post('/login', async (req, res) => {
  try {
    let result = await db.query(
      'SELECT id, password FROM users WHERE email = $1 LIMIT 1',
      [req.body.email]
    );

    console.log('result', result);

    if (result.rows.length < 1) {
      return res.status(401).send({ error: 'Unknown username or password' });
    }
    const user = result.rows[0];
    console.log('login ID:', user.id);

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'There was a problem logging in' });
  }
});

authRouter.post('/register', async (req, res) => {
  console.log(req.body);
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  try {
    let result = await db.query(
      'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING id',
      [req.body.firstName, req.body.lastName, req.body.email, hashedPassword]
    );

    console.log('Register ID:', result.rows[0].id);

    var token = jwt.sign({ id: result.rows[0].id }, config.get('secret'), {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    console.log(err);
    return res.status(500).send('There was a problem registering the user.');
  }
});

app.use('/auth', authRouter);
