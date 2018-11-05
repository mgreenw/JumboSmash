// @flow

// Taken from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function isValidUrl(str: string) {
  /* eslint-disable */
  const pattern = /(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  /* eslint-enable */
  return pattern.test(str);
}

module.exports = isValidUrl;
