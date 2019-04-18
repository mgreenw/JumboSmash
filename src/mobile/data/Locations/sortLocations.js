// @flow
import type { Location } from './index';

/** Given an ordering of Location Codes, returns a compare function that can be used by .sort
 *  to put that ordering at the begining of the list.
 *
 * @param {string[]} codeOrder - Array of Location Codes in the order to prioritize them.
 * @return {function(a: Location, b:Location): number} compare function
 *
 * @example Locations.sort(priorityCompare(["na.us.ma.7", "na.us.ny.70"]))
 */
function priorityCompare(codeOrder: string[]) {
  return (a: Location, b: Location) => {
    const indexA = codeOrder.indexOf(a.code);
    const indexB = codeOrder.indexOf(b.code);
    if (indexA >= 0) {
      if (indexB >= 0) {
        return indexA - indexB;
      }
      return -1;
    }
    return 0;
  };
}

/**
 * Compare function that can be used by .sort for Location lists.
 * Orders Locations by Country, then State, then City.
 * If Country and/or State are missing, the next level is used for sorting.
 * This preserves an ordering like:
 * `[Washington, Seattle, Tacoma]`
 *
 * @param {Location} a
 * @param {Location} b
 * @returns {-1 | 0 | 1 }
 */
function locationAlphabetizeCompare(a: Location, b: Location): -1 | 0 | 1 {
  const countryA = a.type === 'COUNTRY' ? a : a.ancestors.country;
  const countryB = b.type === 'COUNTRY' ? b : b.ancestors.country;

  if (countryA && countryB) {
    if (countryA.name < countryB.name) return -1;
    if (countryA.name > countryB.name) return 1;
  }

  const stateA = a.type === 'STATE' ? a : a.ancestors.state;
  const stateB = b.type === 'STATE' ? b : b.ancestors.state;

  if (stateA && stateB) {
    if (stateA.name < stateB.name) return -1;
    if (stateA.name > stateB.name) return 1;
  }

  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

function alphabetizeLocations(locations: Location[]): Location[] {
  return [...locations].sort(locationAlphabetizeCompare);
}

function prioritizeLocations(
  locations: Location[],
  codeOrder: string[]
): Location[] {
  return [...locations].sort(priorityCompare(codeOrder));
}

export { alphabetizeLocations, prioritizeLocations };
