// @flow

/**
 * Helper script to organize locations better.
 */

const LOCATIONS_MAP: {
  [code: string]: Location
} = require('../data/Locations.json');

const LOCATIONS_ARRAY: LocationWithCode[] = Object.keys(LOCATIONS_MAP).map(
  code => ({
    code,
    ...LOCATIONS_MAP[code]
  })
);

function main() {}

main();
