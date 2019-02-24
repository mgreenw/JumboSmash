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
const config = require('config');
/* eslint-disable-next-line */
const Chance = require('chance'); // It's a dev dependency...duh
const chance = new Chance();

const aws = require('../aws');
const db = require('../db');
const utils = require('../utils');

const { apply: createProfile } = require('../api/users/finalize-profile-setup');
const { apply: judge } = require('../api/relationships/judge');
const { apply: getProfile } = require('../api/users/get-profile');

const bucket = config.get('s3_bucket');
const NODE_ENV = utils.getNodeEnv();

aws.config.region = 'us-east-1';

const s3 = new aws.S3({ region: 'us-east-1', signatureVersion: 'v4' });

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


(async () => {
  if (NODE_ENV === undefined) {
    console.log('Must define NODE_ENV in environment.');
    process.exit(1);
  }
  if (NODE_ENV === 'development') {
    console.log('Welcome! Get ready...');
    const response = await s3.listObjectsV2({
      Bucket: bucket,
      Prefix: `photos/${NODE_ENV}`,
    }).promise();
    const uuids = response.Contents.map((photo) => {
      return photo.Key.split('/')[2];
    });

    const photosResult = await db.query('SELECT uuid FROM photos');
    const dbUuids = photosResult.rows.map(photo => photo.uuid);
    const availableUuids = uuids.filter(uuid => !dbUuids.includes(uuid));
    console.log(`There are ${availableUuids.length} photos available. That means you can make ${availableUuids.length} test users.`);
    const myUserId = await askQuestion('First, what is your user id?');
    const usersToAdd = await askQuestion('How many users would you like to add (<count before)?');
    const newUserCount = Math.min(usersToAdd, availableUuids.length);
    const scene = await askQuestion('What scene should these users like you in (smash/social/stone)?');
    console.log("Lit. Let's go.");

    const actualUuidsToUse = availableUuids.slice(0, newUserCount);

    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    for (const uuid of actualUuidsToUse) {
      try {
        const first = chance.first({ nationality: 'en' });
        const last = chance.last({ nationality: 'en' });

        const utln = `${first[0]}${last.slice(0, 5)}${chance.integer({ min: 1, max: 99 }).toString().padStart(2, '0')}`.toLowerCase();
        const userResponse = await db.query(`
          INSERT INTO classmates
            (utln, email, want_he, want_she, want_they, use_he, use_she, use_they, active_smash, active_social, active_stone)
          VALUES ($1, $2, true, true, true, true, true, true, true, true, true)
          RETURNING id
        `, [utln, `${utln}@tufts.edu`]);

        const [{ id }] = userResponse.rows;

        const birthday = chance.birthday({ year: chance.year({ min: 1990, max: 2000 }) });
        const day = birthday.getDate();
        const monthIndex = birthday.getMonth();
        const year = birthday.getFullYear();

        await db.query(`
          INSERT INTO PHOTOS (user_id, index, uuid)
          VALUES ($1, 1, $2)
        `, [id, uuid]);

        await createProfile(id, {
          bio: chance.paragraph({ sentences: 5 }),
          displayName: first,
          birthday: `${year}-${monthIndex}-${day}`,
        });

        const res = await judge(id, scene, myUserId, true);
        console.log(res);

        const profile = await getProfile(id);
        console.log(`Made user: ${JSON.stringify(profile, null, 2)}`);
      } catch (error) {
        console.log(error);
      }
    }

    console.log('Done!');
  } else if (NODE_ENV !== 'testing') {
    console.log(`Careful: do not perform this action outside of your local computer (you just tried on ${NODE_ENV}).`);
    process.exit(1);
  }
})();
