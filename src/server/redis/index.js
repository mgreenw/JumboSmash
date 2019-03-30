// @flow

const Redis = require('ioredis');
const config = require('config');

const redisConfig = config.get('redis');

const shared = new Redis(redisConfig.port, redisConfig.host);

module.exports = {
  shared,
};
