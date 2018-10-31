/*
 *  check-node-verson.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Ensure the Node version being used is consistent with the Node version
 *  required in the package.json
 *
 */

/* eslint-disable no-console */

const readline = require('readline');

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

async function dropOwnedTables() {
  if (NODE_ENV === undefined) {
    console.log('Must define NODE_ENV in environment.');
    process.exit(1);
  }
  if (NODE_ENV === 'development') {
    const ans = await askQuestion('Are you sure you want to drop all of the tables in your development database (y/n)?');
    console.log(ans);
    if (ans.toLowerCase() !== 'y') {
      process.exit(1);
    }
  } else if (NODE_ENV !== 'testing') {
    console.log(`Careful: do not perform this action outside of your local computer (you just tried on ${NODE_ENV}).`);
    process.exit(1);
  }

  await db.query('DROP OWNED BY CURRENT_USER CASCADE;');
  console.log(`✓ Dropped all tables in ${NODE_ENV} database.`);
}

dropOwnedTables();
