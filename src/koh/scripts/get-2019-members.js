// @flow
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable no-console */

const readline = require('readline');
const ldap = require('../controllers/utils/ldap');
const db = require('../db');

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

async function insertMember(member) {
  try {
    await db.query(`
      INSERT INTO MEMBERS
      (utln, exists, email, given_name, college, trunk_id, class_year, last_name, display_name, major)
      VALUES ($1, true, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [member.uid, member.mail, member.givenName, member.tuftsEduCollege, member.tuftsEduTrunk, member.tuftsEduClassYear, member.sn, member.displayName, member.tuftsEduMajor]);
  } catch (error) {
    console.log(`failed to insert member ${member.uid}`);
    console.log(error);
  }
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

const members = {};
const trunkFirstChars = ints.concat(alphabet);

function makeQuery(firstChar: string | number, secondChar: string | number) {
  return `(&(tuftsEduTrunk=${firstChar}${secondChar}*)(tuftsEduClassYear=19)(|(tuftsEduCollege=COLLEGE OF LIBERAL ARTS)(tuftsEduCollege=SCHOOL OF ENGINEERING)))`;
}

const question = `Hey! You are now getting all the members of the Class of 2019.
That's pretty cool, but it's also dangerous. This script will call 256 unique LDAP queries.
Please only run this if it is really needed.
To continue, type 'I solemnly swear that I am up to no good': `;

const insertions = [];

async function main() {
  const answer = await askQuestion(question);
  if (answer !== 'I solemnly swear that I am up to no good') {
    process.exit(1);
  }

  const response = await askQuestion('Final question: do you want to insert the new users into koh? (y/n) ')
  const insertUsers = response === 'y';
  for (const firstChar of trunkFirstChars) {
    for (const secondChar of trunkFirstChars) {
      const query = makeQuery(firstChar, secondChar);
      const results = await ldap.search(query, attributes);
      if (results.entries.length > 100) {
        console.log(`HEADS UP: you may have missed some. the query for ${firstChar}${secondChar}* had ${results.entries.length} results`);
      }
      results.entries.forEach((member) => {
        let tuftsEduCollege;
        switch (member.tuftsEduCollege) {
          case 'COLLEGE OF LIBERAL ARTS':
            tuftsEduCollege = 'A&S';
            break;
          case 'SCHOOL OF ENGINEERING':
            tuftsEduCollege = 'E';
            break;
          default:
            throw new Error("This shouldn't happen");
        }

        // Insert the member and respond with the member info
        if (insertUsers) {
          const insertion = insertMember({ ...member, tuftsEduCollege });
          insertions.push(insertion);
        }

        members[member.uid] = member;
      });
    }
  }

  // Makes sure all insertions are complete
  await Promise.all(insertions);

  console.log('JSON Entries:\n\n\n');
  console.log(JSON.stringify(members, null, 2));
}

main();
