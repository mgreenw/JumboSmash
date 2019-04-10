// @flow
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const readline = require('readline');
const ldap = require('../controllers/utils/ldap');

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

const attributes = [
  'uid',
  'givenName',
  'mail',
  'tuftsEduCollege',
  'uid',
  'tuftsEduTrunk',
  'tuftsEduClassYear',
  'sn',
  'displayName',
  'tuftsEduMajor',
];

// Trunk ids are only 0-9 and A-F
const ints = new Array(10).fill(0).map((e, i) => i);
const alphabet = new Array(6).fill(0).map((e, i) => String.fromCharCode(97 + i).toUpperCase());

const people = {};
const trunkFirstChars = ints.concat(alphabet);

function makeQuery(firstChar: string | number, secondChar: string | number) {
  return `(&(tuftsEduTrunk=${firstChar}${secondChar}*)(tuftsEduClassYear=19)(|(tuftsEduCollege=COLLEGE OF LIBERAL ARTS)(tuftsEduCollege=SCHOOL OF ENGINEERING)))`;
}

const question = `Hey! You are now getting all the members of the Class of 2019.
That's pretty cool, but it's also dangerous. This script will call 256 unique LDAP queries.
Please only run this if it is really needed.
To continue, type 'I solemnly swear that I am up to no good': `;

async function main() {
  const answer = await askQuestion(question);
  if (answer !== 'I solemnly swear that I am up to no good') {
    process.exit(1);
  }

  for (const firstChar of trunkFirstChars) {
    for (const secondChar of trunkFirstChars) {
      const query = makeQuery(firstChar, secondChar);
      const results = await ldap.search(query, attributes);
      if (results.entries.length > 100) {
        console.log(`HEADS UP: you may have missed some. the query for ${firstChar}${secondChar}* had ${results.entries.length} results`);
      }
      results.entries.forEach((person) => {
        people[person.uid] = person;
      });
    }
  }
  console.log('JSON Entries:\n\n\n');
  console.log(JSON.stringify(people, null, 2));
}

main();
