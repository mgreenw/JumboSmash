// @flow
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const ldap = require('../controllers/utils/ldap');

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

const ints = new Array(10).fill(0).map((e, i) => i);
const alphabet = new Array(6).fill(0).map((e, i) => String.fromCharCode(97 + i).toUpperCase());

const people = {};
const trunkFirstChars = ints.concat(alphabet);

function makeQuery(firstChar: string | number, secondChar: string | number) {
  return `(&(tuftsEduTrunk=${firstChar}${secondChar}*)(tuftsEduClassYear=19)(|(tuftsEduCollege=COLLEGE OF LIBERAL ARTS)(tuftsEduCollege=SCHOOL OF ENGINEERING)))`;
}

async function main() {
  for (const firstChar of trunkFirstChars) {
    for (const secondChar of trunkFirstChars) {
      const query = makeQuery(firstChar, secondChar);
      const results = await ldap.search(query, attributes);
      results.entries.forEach((person) => {
        people[person.uid] = person;
      });
    }
  }
  console.log(JSON.stringify(people, null, 2));
}


main();
