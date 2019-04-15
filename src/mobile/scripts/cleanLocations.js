// @flow
/* eslint-disable */

/**
 * Helper script to make location data nice.
 * Mediocre code quality, but this is for statically cleaning data.
 */

const fs = require('fs');
const LOCATIONS = require('../data/Locations.json');
const LOCATION_EDITS = require('../data/LocationEdits.json');

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
 * What would you do if you could go back, just once?
 */
function changeHistory(name, newName) {
  return `${name} -> \`${newName}\``;
}

/**
 *
 * @param {string} name to be stripped of state info
 * @returns {string}
 */
function formatName(name) {
  let formattedName = name;
  let history = `\`${name}\``;

  // Remove everything after a comma. e.g. `Norfolk, Virginia Area`
  const commaIndex = formattedName.indexOf(',');
  if (commaIndex !== -1) {
    const removePostComma = formattedName.substring(0, commaIndex);
    formattedName = removePostComma;
    history = changeHistory(history, removePostComma);
  }

  const areaIndex = formattedName.indexOf(' Area');
  if (areaIndex !== -1) {
    const removeArea = formattedName.substring(0, areaIndex);
    formattedName = removeArea;
    history = changeHistory(history, removeArea);
  }

  const greaterIndex = formattedName.indexOf('Greater ');
  if (greaterIndex !== -1) {
    const removeGreater = formattedName.replace('Greater ', '');
    formattedName = removeGreater;
    history = changeHistory(history, removeGreater);
  }

  console.log(history);
  return formattedName;
}

const CODE_COUNT_TYPE = ['CONTINENT', 'COUNTRY', 'STATE', 'CITY'];

/**
 *
 * @param {number} index
 */
function FilterLocation(len, source, greaterThan = false) {
  const codes = Object.keys(source).filter(c =>
    greaterThan ? c.length >= len : c.length === len
  );

  const locations = {};
  for (let i = 0; i < codes.length; ++i) {
    const code = codes[i];
    const deleted = LOCATION_EDITS.deleted[code] || false;

    const type = CODE_COUNT_TYPE[[...code].filter(char => char === '.').length];

    let edits = {};
    if (type === 'STATE') edits = LOCATION_EDITS.edited.states[code] || {};
    if (type === 'CITY') edits = LOCATION_EDITS.edited.cities[code] || {};

    if (Object.keys(edits).length !== 0)
      console.log('EDITTING: ', source[code], ' TO: ', edits);

    // skip adding a DELETE edit.
    if (!deleted) {
      const { code: codeEdit = code } = edits;
      locations[codeEdit] = {
        ...source[code],
        alias: [],
        ...edits,
        type
      };
    } else {
      console.log('DELETED: ', LOCATIONS.linkdin[code]);
    }
  }
  const locationsWidthAdded = {
    ...locations
  };
  return locationsWidthAdded;
}

const Continents = FilterLocation(2, LOCATIONS.linkdin);

const Countries = FilterLocation(5, LOCATIONS.linkdin);

// (And state like things, like providences)
const States = FilterLocation(8, LOCATIONS.linkdin);

const Cities = FilterLocation(10, LOCATIONS.linkdin, true);
const AddedCities = FilterLocation(10, LOCATION_EDITS.added.cities, true);

/**
 * only call this AFTER Continents, Countries, Staes, and Cities have been made!
 */
function AddParents(locations) {
  const codes = Object.keys(locations);

  const newLocations = {};
  for (let i = 0; i < codes.length; ++i) {
    const code = codes[i];

    // We don't care about the city because it's the smallest child, so won't show up as a parent.
    const [continentSufix, countryCodeSuffix, stateCodeSuffix] = code.split(
      '.'
    );

    const continentCode = continentSufix || null;
    const countryCode = countryCodeSuffix
      ? `${continentCode}.${countryCodeSuffix}`
      : null;
    const stateCode =
      stateCodeSuffix && stateCodeSuffix !== '*'
        ? `${continentCode}.${countryCodeSuffix}.${stateCodeSuffix}`
        : null;

    const ancestors = {
      continent: continentCode
        ? { code: continentCode, name: Continents[continentCode].name }
        : null,
      country: countryCode
        ? { code: countryCode, name: Countries[countryCode].name }
        : null,
      state: stateCode
        ? { code: stateCode, name: States[stateCode].name }
        : null
    };

    newLocations[code] = {
      ...locations[code],
      ancestors
    };
  }
  return newLocations;
}

function main() {
  const cities = {
    ...Cities,
    ...AddedCities
  };
  const data = {
    Continents,
    Countries: AddParents(Countries),
    States: AddParents(States),
    Cities: AddParents(cities)
  };

  // Clean the names of all cities
  console.log('\n------------------------------------------------------');
  console.log('CLEANING CITIES:');
  Object.keys(data.Cities).forEach(code => {
    const { name } = data.Cities[code];
    data.Cities[code].name = formatName(name);
  });

  // Clean the names of all cities (These actually are all fine, but a nice sanity check!)
  console.log('\n------------------------------------------------------');
  console.log('CLEANING STATES:');
  Object.keys(data.States).forEach(code => {
    const { name } = data.States[code];
    data.States[code].name = formatName(name);
  });

  writeToFile(data);
}

main();
