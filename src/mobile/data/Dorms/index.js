// @flow

const DormNameMap: { [code: string]: string } = require('./Dorms.json');

const DormCodeList: string[] = Object.keys(DormNameMap);

/**
 * Turn a Dorm code into a nice name to display.
 * @param {string} code
 * @returns {?Location} Location, or null if not found
 */
function codeToName(code: string): ?string {
  return DormNameMap[code] || null;
}

export { DormCodeList, codeToName };
