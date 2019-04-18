// @flow

/**
 *
 * @param {s} string to capitalize
 * @returns capitalized version of `s`
 * @example capitalize('foo') === 'Foo'
 */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default capitalize;
