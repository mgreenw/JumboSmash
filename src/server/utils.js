// @flow

const config = require('config');
const { version } = require('./package.json');

function getNodeEnv() {
  return config.util.getEnv('NODE_CONFIG_ENV');
}

module.exports = {
  getNodeEnv,
  version,
};
