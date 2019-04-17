// @flow

import { alphabetizeLocations, prioritizeLocations } from './sortLocations';

type LocationLevelType = 'CITY' | 'STATE' | 'COUNTRY' | 'CONTINENT';

export type LocationAncestor = {
  code: string,
  name: string
};

export type LocationAncestors = {
  continent: ?LocationAncestor,
  country: ?LocationAncestor,
  state: ?LocationAncestor,
  type: LocationLevelType
};

export type Location = {
  name: string,
  code: string,
  type: LocationLevelType,
  alias: string[],
  ancestors: LocationAncestors,
  image?: string
};

const LOCATIONS: {
  Continents: { [code: string]: Location },
  Countries: { [code: string]: Location },
  States: { [code: string]: Location },
  Cities: { [code: string]: Location },
  Priority: string[]
} = require('./FormatedLocations.json');

const States = Object.keys(LOCATIONS.States).map(
  code => LOCATIONS.States[code]
);

const Cities = Object.keys(LOCATIONS.Cities).map(
  code => LOCATIONS.Cities[code]
);

const AlphabeticalLocations = alphabetizeLocations([...States, ...Cities]);
const PrioritizedAlphabeticalLocations = prioritizeLocations(
  [...AlphabeticalLocations],
  LOCATIONS.Priority
);

/**
 *
 * @param {Location} location
 * @returns {string} a nicely formatted version of where the location is.
 */
function formatLocationAncestors(location: Location): string {
  if (!location.ancestors) return '';
  const { country, state } = location.ancestors;
  if (state && country) return `${state.name}, ${country.name}`;
  if (state) return state.name;
  if (country) return country.name;
  return '';
}

const CODE_COUNT_TYPE: LocationLevelType[] = [
  'CONTINENT',
  'COUNTRY',
  'STATE',
  'CITY'
];

/**
 * Turn a Location code into a nice name to display.
 * @param {string} code
 * @returns {?Location} Location, or null if not found
 */
function codeToLocation(code: string): ?Location {
  const type = CODE_COUNT_TYPE[[...code].filter(char => char === '.').length];
  switch (type) {
    case 'CITY': {
      return LOCATIONS.Cities[code] || null;
    }
    case 'CONTINENT': {
      return LOCATIONS.Continents[code] || null;
    }
    case 'COUNTRY': {
      return LOCATIONS.Countries[code] || null;
    }
    case 'STATE': {
      return LOCATIONS.States[code] || null;
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (type: empty);
      return null;
    }
  }
}

export {
  AlphabeticalLocations,
  PrioritizedAlphabeticalLocations,
  formatLocationAncestors,
  codeToLocation
};
