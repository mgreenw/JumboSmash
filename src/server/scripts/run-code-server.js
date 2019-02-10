/*
 *  check-dependencies.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Ensure the dependencies of the server are up to date. Print errors to
 *  stdout, and exit with code 1 if errors, and 0 if no errors.
 *
 */

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

const express = require('express');
const { Pool } = require('pg');

// I REALLY don't want this to be run in production, so I am going to bake in
// the dev credentials - not recommended but I don't really care. This ensures
// that this endpoint is never exposed.
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'jumbosmash',
  user: 'jumbosmashdev',
  password: 'tonysmash2019',
});

const app = express();

app.get('/:utln', async (req, res) => {
  const result = await pool.query(`
    SELECT code
    FROM verification_codes
    WHERE utln = $1
  `, [req.params.utln]);

  return res.status(200).json({
    code: result.rows[0].code,
  });
});

app.listen(3094, () => {
  console.log('DEVELOPMENT ONLY. Code server listening on 3094');
});
