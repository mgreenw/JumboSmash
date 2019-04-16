// @flow

import { alphabetizeLocations, prioritizeLocations } from './sortLocations';

export type LocationAncestor = {
  code: string,
  name: string
};

export type LocationAncestors = {
  continent: ?LocationAncestor,
  country: ?LocationAncestor,
  state: ?LocationAncestor,
  type: 'CITY' | 'STATE' | 'COUNTRY' | 'CONTINENT'
};

export type Location = {
  name: string,
  code: String,
  type: string,
  alias: string[],
  ancestors: LocationAncestors
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

export { AlphabeticalLocations, PrioritizedAlphabeticalLocations };
