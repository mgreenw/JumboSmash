// @flow

/**
 * Helper script to organize locations better.
 */

const fs = require('fs');
const LOCATIONS = require('../data/Locations.json');

// const LOCATIONS_ARRAY = Object.keys(LOCATIONS_MAP).map(code => ({
//   code,
//   ...LOCATIONS_MAP[code]
// }));

function writeToFile(content) {
  fs.writeFileSync('./data/FormatedLocations.json', JSON.stringify(content));
}

/**
 *
 * @param {string} code
 * @param {Object} locationData
 * @returns {Object} locatonData with its key, the code, as a property.
 */
function addCode(code, locationData) {
  return {
    ...locationData,
    code
  };
}

/**
 *
 * @param {number} index
 */
function FilterLocation(len, greaterThan = false) {
  const codes = Object.keys(LOCATIONS.linkdin).filter(c =>
    greaterThan ? c.length >= len : c.length === len
  );

  const locations = {};
  for (let i = 0; i < codes.length; ++i) {
    const code = codes[i];
    locations[code] = {
      ...LOCATIONS.linkdin[code],
      code,
      alias: []
    };
  }
  return locations;
}

function Continents() {
  return FilterLocation(2);
}

function Countries() {
  return FilterLocation(5);
}

function States() {
  return FilterLocation(8);
}

function Cities() {
  return FilterLocation(10, true);
}

function main() {
  const data = {
    Continents: Continents(),
    Countries: Countries(),
    States: States(),
    Cities: Cities()
  };
  console.log(data);
  writeToFile(data);
}

main();
