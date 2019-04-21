// @flow

const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const config = require('config');
const redis = require('./redis');
const { version } = require('./package.json');

function rateLimiter(options: { [string]: any }) {
  return new RateLimit({
    store: new RedisStore({
      client: redis.shared,
      prefix: 'gem:ratelimit:',
      // see Configuration
    }),
    ...options,
  });
}

function getNodeEnv() {
  return config.util.getEnv('NODE_CONFIG_ENV');
}

module.exports = {
  getNodeEnv,
  version,
  rateLimiter,
};
