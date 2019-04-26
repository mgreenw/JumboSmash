// @flow

/* eslint-disable no-console */

const readline = require('readline');
const db = require('../db');
const expo = require('../expo');

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

async function main() {
  const users = await db.query(`
    SELECT id FROM users WHERE expo_push_token IS NOT NULL AND notifications_enabled
  `);

  const subtitle = await askQuestion('What would you like the subtitle to be? ');
  const body = await askQuestion('What would you like to say? ');

  const confirmation = await askQuestion(`You are about to send "${subtitle}" : "${body}" to ${users.rows.length} users. Proceed (y/n)? `);
  if (confirmation !== 'y') {
    console.log('Bye.');
    process.exit(1);
  }

  const notification = {
    sound: 'default',
    body,
    subtitle,
  };

  const notifications = users.rows.map(({ id }) => ({
    ...notification,
    userId: id,
  }));

  await expo.sendNotifications(notifications);

  console.log('Sent sucessfully!');
  process.exit(0);
}

main();
