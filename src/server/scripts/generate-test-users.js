/*
 *  generate-test-users
 *  Author: Max Greenwald
 *  Date: 3/27/19
 *
 *  Generate test users for load testing
 *
 */

/* eslint-disable no-console */

const readline = require('readline');
const config = require('config');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
/* eslint-disable-next-line */
const Chance = require('chance'); // It's a dev dependency...duh
const chance = new Chance();

const db = require('../db');
const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
}

function getRandomInt(min, max) {
  const intMin = Math.ceil(min);
  const intMax = Math.floor(max);
  return Math.floor(Math.random() * (intMax - intMin)) + intMin;
  // The maximum is exclusive and the minimum is inclusive
}


(async () => {
  if (NODE_ENV === undefined) {
    console.log('Must define NODE_ENV in environment.');
    process.exit(1);
  }
  const shouldContinue = await askQuestion(`Welcome! You are running in ${NODE_ENV}. Continue (y)? `);
  if (shouldContinue !== 'y') {
    console.log('Bye.');
  }

  const userCount = await askQuestion('How many users would you like to generate? ');
  console.log('OK. Here is a csv of users:\n');
  console.log('id,utln,token');

  const userCountInt = parseInt(userCount, 10);

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < userCountInt; i += 1) {
    const first = chance.first({ nationality: 'en' });
    const last = chance.last({ nationality: 'en' });
    const tokenUUID = uuidv4();

    const utln = `${first[0]}${last.slice(0, 5)}${chance.integer({ min: 1, max: 99 }).toString().padStart(2, '0')}`.toLowerCase();
    const userResponse = await db.query(`
      INSERT INTO classmates
        (utln, email, want_he, want_she, want_they, use_he, use_she, use_they, active_smash, active_social, active_stone, token_uuid)
      VALUES ($1, $2, true, true, true, true, true, true, true, true, true, $3)
      RETURNING id
    `, [utln, `${utln}@tufts.edu`, tokenUUID]);

    const [{ id }] = userResponse.rows;

    const photoCount = getRandomInt(1, 5);
    for (let photoIndex = 1; photoIndex <= photoCount; photoIndex += 1) {
      await db.query(`
        INSERT INTO PHOTOS (user_id, index, uuid)
        VALUES ($1, $2, $3)
      `, [id, photoIndex, uuidv4()]);
    }

    const token = jwt.sign({
      userId: id,
      uuid: tokenUUID,
    }, config.secret, {
      expiresIn: 31540000, // expires in 365 days
    });

    console.log([id, utln, token].join(','));
  }

  process.exit(0);
})();
