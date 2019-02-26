export function arrayToQueryString(key, array) {
  return array.map(val => `${key}=${val}`).join('&');
}
