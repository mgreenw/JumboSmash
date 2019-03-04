// @flow

const config = require('config');

function getNodeEnv() {
  return config.util.getEnv('NODE_CONFIG_ENV');
}

module.exports = {
  getNodeEnv,
};
