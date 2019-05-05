// @flow

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

const _ = require('lodash');
const readline = require('readline');
const uuidv4 = require('uuid/v4');
const db = require('../db');
const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

type Scene = 'smash' | 'social';

type Match = {
  utln: string,
  scenes: Scene[],
  messagesFromMatch: string[],
};

type Tester = {
  utln: string,
  email: string,
  matches: Match[],
};

const testers: Tester[] = [
  {
    utln: 'tester',
    email: 'tester@jumbosmash.com',
    matches: [
      {
        utln: 'jjaffe01',
        scenes: ['smash'],
        messagesFromMatch: [],
      },
      {
        utln: 'mgreen14',
        scenes: ['social'],
        messagesFromMatch: ['Hey! This is a test message'],
      },
      // Note: the relationship with tester2 is defined in tester 2
      // so we must not define it twice
    ],
  },
  {
    utln: 'tester2',
    email: 'tester2@jumbosmash.com',
    matches: [
      {
        utln: 'jjaffe01',
        scenes: ['smash'],
        messagesFromMatch: [],
      },
      {
        utln: 'mgreen14',
        scenes: ['social'],
        messagesFromMatch: ['Hey! This is a test message'],
      },
      {
        utln: 'tester',
        scenes: ['smash', 'social'],
        messagesFromMatch: [
          'Hey! You are the other test user.',
        ],
      },
    ],
  },
];

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

function exit() {
  console.log('Bye.');
  process.exit(1);
}

async function idFromUtln(utln: string) {
  const result = await db.query(`
    SELECT id
    FROM users
    WHERE utln = $1
  `, [utln]);

  if (result.rowCount === 0) {
    console.log(`Could not find user with utln ${utln}`);
    exit();
  }
  return result.rows[0].id;
}


async function main() {
  console.log(`NODE_ENV=${NODE_ENV}`);

  // 1. Ensure all matches exist.
  const testerUtlns = testers.map(tester => tester.utln);
  const matchUtlns = _.uniq(
    _.without(
      _.flatten(testers.map(tester => tester.matches.map(match => match.utln))),
      ...testerUtlns,
    ),
  );

  const matches = await db.query(`
    SELECT id
    FROM users
    WHERE utln = ANY($1)
  `, [matchUtlns]);

  if (matches.rowCount !== matchUtlns.length) {
    console.log(`Not all of ${JSON.stringify(matchUtlns)} exist as users in the db.`);
    exit();
  }

  console.log(JSON.stringify(testers, null, 2));
  console.log(`You are about to insert ${testers.length} test users:`);
  console.log('HEADS UP: you should delete these users from the database before running this script.');
  const proceed = await askQuestion('Proceed (y/n)? ');
  if (proceed !== 'y') exit();

  // 2. Insert the test users if they do not already exist.
  // NOTE: testers should not have push tokens
  for (const tester of testers) {
    await db.query(`
      INSERT INTO users
        (utln, email, expo_push_token)
        VALUES ($1, $2, null)
      ON CONFLICT (utln)
        DO UPDATE
          SET expo_push_token = null
      RETURNING id
    `, [tester.utln, tester.email]);
  }

  // 2. Create relationships between all the users
  for (const tester of testers) {
    for (const match of tester.matches) {
      const testerUserId = await idFromUtln(tester.utln);
      const matchUserId = await idFromUtln(match.utln);

      const smash = match.scenes.includes('smash');
      const smashDate = smash ? new Date() : null;

      const social = match.scenes.includes('social');
      const socialDate = social ? new Date() : null;

      await db.query(`
        INSERT INTO relationships
          (critic_user_id, candidate_user_id, liked_smash, swiped_smash_timestamp, liked_social, swiped_social_timestamp)
          VALUES
            ($1, $2, $3, $4, $5, $6),
            ($2, $1, $3, $4, $5, $6)
        ON CONFLICT ON CONSTRAINT pk_critic_candidate
          DO UPDATE
            SET
              liked_smash = $3,
              swiped_smash_timestamp = $4,
              liked_social = $5,
              swiped_social_timestamp = $6
      `, [testerUserId, matchUserId, smash, smashDate, social, socialDate]);

      if (smash) {
        await db.query(`
          INSERT INTO messages
            (content, unconfirmed_message_uuid, sender_user_id, receiver_user_id, from_system)
            VALUES ('MATCHED_SMASH', $1, $2, $3, TRUE)
        `, [uuidv4(), testerUserId, matchUserId]);
      }

      if (social) {
        await db.query(`
          INSERT INTO messages
            (content, unconfirmed_message_uuid, sender_user_id, receiver_user_id, from_system)
            VALUES ('MATCHED_SOCIAL', $1, $2, $3, TRUE)
        `, [uuidv4(), testerUserId, matchUserId]);
      }

      for (const messageContent of match.messagesFromMatch) {
        await db.query(`
          INSERT INTO messages
            (content, unconfirmed_message_uuid, sender_user_id, receiver_user_id, from_system)
            VALUES ($1, $2, $3, $4, FALSE)
        `, [messageContent, uuidv4(), matchUserId, testerUserId]);
      }
    }
  }

  console.log('Success!');
  process.exit(0);
}

main();
