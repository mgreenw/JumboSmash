// @flow

const redis = require('../redis');
const logger = require('../logger');

async function getBadgeCount(userId: number | string): Promise<number> {
  const badge = await redis.shared.hlen(redis.unreadConversationsKey(userId));
  logger.debug(`Badge count for user ${userId}: ${badge}`);
  return badge;
}

module.exports = getBadgeCount;
