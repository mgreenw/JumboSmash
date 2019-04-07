/*
 *  insert-admin.js
 *  Author: Max Greenwald
 *  Date: 3/2/19
 *
 *  Insert an admin into the database.
 *
 */

/* eslint-disable no-console */
/* eslint-disable-next-line */
require('@babel/register');

const readline = require('readline');
const Chance = require('chance');

const db = require('../db');
const authUtils = require('../api/auth/utils');

const chance = new Chance();

function askQuestion(query, yesNoQuestion = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, (ans) => {
    rl.close();
    if (yesNoQuestion) {
      return resolve(ans.toLowerCase() === 'y');
    }
    return resolve(ans);
  }));
}

(async () => {
  const utln = await askQuestion("What is the admin's utln? ");
  const users = await db.query('SELECT id FROM users WHERE utln = $1', [utln]);
  let id;
  if (users.rowCount > 0) {
    [{ id }] = users.rows;
  } else {
    const memberInfoResponse = await authUtils.getMemberInfo(`${utln}@tufts.edu`);
    if (memberInfoResponse.status !== 'GET_MEMBER_INFO__SUCCESS') {
      console.log('No classmate with that utln. Sorry! KOH RULES.');
      process.exit(1);
    }
    const { member } = memberInfoResponse;

    const shouldCreateUser = await askQuestion('There is no user with that utln. Should I create that user (y/n)? ', true);
    if (!shouldCreateUser) {
      console.log('Bye!');
      process.exit(1);
    }

    const result = await db.query(`
      INSERT INTO classmates
        (utln, email)
        VALUES ($1, $2)
      RETURNING id
    `, [member.utln, member.email]);
    /* eslint-disable prefer-destructuring */
    id = result.rows[0].id;
  }

  console.log('Sweet! Inserting the admin.');

  const word = () => chance.first({ nationality: 'en' }).toLowerCase();

  const password = [word(), word(), word(), word()].join('-');

  try {
    await db.query(`
      UPDATE classmates
      SET admin_password = $1
      WHERE id = $2
    `, [password, id]);

    console.log(`The admin was created. Their password is:\n${password}`);
  } catch (error) {
    console.log('Something went wrong. I bet the admin already exists. Try again.');
    console.error(error);
  }

  process.exit(0);
})();
