// @flow

const Redis = require('ioredis');
const config = require('config');

const redisConfig = config.get('redis');

const shared = new Redis(redisConfig.port, redisConfig.host);

shared.defineCommand('updateUnreadConversation', {
  numberOfKeys: 1,
  lua: `
    local timestamp = redis.call('hget', KEYS[1], ARGV[1])
    local conversationRead = timestamp == ARGV[2]
    if conversationRead then
      redis.call('hdel', KEYS[1], ARGV[1])
    end
    return conversationRead
  `,
});

const prefix = 'gem';
function unreadConversationsKey(userId: number) {
  return `${prefix}:unread-conversations userId:${userId}`;
}


module.exports = {
  shared,
  prefix,
  unreadConversationsKey,
};
