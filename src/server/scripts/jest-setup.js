const redis = require('../redis');

beforeAll(async () => {
  await redis.shared.flushall();
});
